import * as fs from "fs/promises";
import * as path from "path";
import * as process from "process";
import * as XLSX from "xlsx";
import {
  BUILD_PATH_LEARNING_OBJECTIVES,
  BUILD_PATH_QUESTIONS,
  BUILD_PATH_SUBJECTS,
  CONTENT_PATH,
} from "../src/contants";
import type {
  CourseName,
  LearningObjective,
  LearningObjectiveId,
  QuestionTemplate,
  QuestionTemplateJson,
  Subject,
  SubjectJson,
} from "@chair-flight/base/types";

const intentionallyLeftBlankPattern = /Intentionally left blank/i;

const courseNames: Record<string, CourseName> = {
  "ATPL(A)": "ATPL_A",
  "CPL(A)": "CPL_A",
  "ATPL(H)/IR": "ATPL_H_IR",
  "ATPL(H)/VFR": "ATPL_H_VFR",
  "CPL(H)": "CPL_H",
  IR: "IR",
  "CBIR(A)": "CBIR_A",
};

export const readAllQuestionsFromFs = async (
  dirPath: string = path.join(process.cwd(), CONTENT_PATH, "questions"),
): Promise<QuestionTemplate[]> => {
  const files = await fs.readdir(dirPath);
  const questions: QuestionTemplate[] = [];
  for (const file of files) {
    const filePath = path.join(dirPath, file);

    if ((await fs.stat(filePath)).isDirectory()) {
      questions.push(...(await readAllQuestionsFromFs(filePath)));
    } else if (path.extname(filePath) === ".json") {
      const json = await fs.readFile(filePath, "utf-8");
      const jsonData = JSON.parse(json) as QuestionTemplateJson[];
      const jsonDataWithSrcLocation = jsonData.map((q) => ({
        ...q,
        srcLocation: filePath.replace(process.cwd(), ""),
      }));
      questions.push(...jsonDataWithSrcLocation);
    }
  }

  return questions;
};

export const readAllLearningObjectivesFromFs = async () => {
  const fileName = path.join(
    process.cwd(),
    CONTENT_PATH,
    "subjects/tk-syllabus.xlsx",
  );
  const questions = await readAllQuestionsFromFs();
  const workbook = XLSX.readFile(fileName);
  const sheetNames = workbook.SheetNames;
  const learningObjectivesMap = sheetNames
    .slice(2)
    .flatMap<LearningObjective>((name) => {
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[name]) as Record<
        string,
        string
      >[];
      return sheet.map<LearningObjective>((row) => {
        const text = (row["2020 syllabus text"] ?? "")
          .replaceAll(":", ":\n- ")
          .replaceAll(";", ";\n- ")
          .replace(/\b[A-Z]+\b/g, (match) => {
            return match.charAt(0) + match.slice(1).toLowerCase();
          })
          .split("Remark:")[0];
        const id =
          row["2020 syllabus reference"]
            ?.replaceAll(".00", "")
            ?.replaceAll(" 00", "")
            ?.trim() ?? "";

        return {
          id,
          courses: Object.keys(courseNames)
            .filter((item) => row[item])
            .map((k) => courseNames[k]),
          questions: [],
          text,
          contentId: id,
          // some sources are just 0 (?)... ignore those!
          source: row["Source / Comment"] || "",
        };
      });
    })
    .filter((lo) => !intentionallyLeftBlankPattern.test(lo.text))
    .reduce<Record<LearningObjectiveId, LearningObjective>>((s, k) => {
      if (!k.contentId) return s;
      s[k.contentId] = k;
      return s;
    }, {});

  // Populate questions
  questions.forEach((q) => {
    (q.learningObjectives ?? []).forEach((lo) => {
      if (learningObjectivesMap[lo]) {
        learningObjectivesMap[lo].questions = [
          ...new Set([...learningObjectivesMap[lo].questions, q.id]),
        ];
      }
    });
  });

  const learningObjectives = Object.values(learningObjectivesMap);

  // Bubble up learning Objectives
  learningObjectives.forEach((lo) => {
    learningObjectives.forEach((lo2) => {
      if (lo2.id.startsWith(lo.id)) {
        lo.courses = [...new Set([...lo.courses, ...lo2.courses])];
      }
    });
  });

  return learningObjectives;
};

export const readAllSubjectsFromFs = async () => {
  const allLearningObjectives = await readAllLearningObjectivesFromFs();
  const filePath = path.join(
    process.cwd(),
    CONTENT_PATH,
    "subjects/subjects.json",
  );
  const fileBuffer = await fs.readFile(filePath, "utf-8");
  const subjects = JSON.parse(fileBuffer) as SubjectJson[];

  return allLearningObjectives.reduce<Subject[]>(
    (acc, lo) => {
      const path = lo.id
        .split(".")
        .map((_, index, arr) => arr.slice(0, index + 1).join("."));

      const subject = acc.find((s) => {
        const key = path[0] === "071" ? "070" : path[0];
        return s.id === key;
      });

      const chapter = subject?.children?.find((c) => path[1].startsWith(c.id));
      const section = chapter?.children?.find((s) => path[2].startsWith(s.id));

      if (!subject || path.length === 1) return acc;

      if (path.length === 2) {
        subject.numberOfQuestions += lo.questions.length;
        subject.children ??= [];
        subject.children.push({
          id: lo.id,
          text: lo.text,
          numberOfQuestions: lo.questions.length,
          numberOfLearningObjectives: 0,
          children: [],
        });
        return acc;
      }

      if (!chapter) throw new Error(`Chapter not found: ${path[1]}`);
      if (path.length === 3) {
        subject.numberOfQuestions += lo.questions.length;
        chapter.numberOfQuestions += lo.questions.length;
        chapter.children ??= [];
        chapter.children.push({
          id: lo.id,
          text: lo.text,
          numberOfQuestions: lo.questions.length,
          numberOfLearningObjectives: 0,
          children: [],
        });
        return acc;
      }

      if (!section) throw new Error(`Section not found: ${path[2]}`);

      subject.numberOfLearningObjectives += 1;
      chapter.numberOfLearningObjectives += 1;
      section.numberOfLearningObjectives += 1;

      subject.numberOfQuestions += lo.questions.length;
      chapter.numberOfQuestions += lo.questions.length;
      section.numberOfQuestions += lo.questions.length;

      return acc;
    },
    subjects.map((s) => ({
      ...s,
      numberOfQuestions: 0,
      numberOfLearningObjectives: 0,
      children: s.children ?? [],
    })),
  );
};

export const buildQuestionBank = async () => {
  const questions = await readAllQuestionsFromFs();
  const subject = await readAllSubjectsFromFs();
  const learningObjectives = await readAllLearningObjectivesFromFs();

  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH_QUESTIONS),
    JSON.stringify(questions),
  );
  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH_SUBJECTS),
    JSON.stringify(subject),
  );
  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH_LEARNING_OBJECTIVES),
    JSON.stringify(learningObjectives),
  );
};
