import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import * as XLSX from "xlsx";
import type {
  CourseName,
  FlashCardContent,
  LearningObjective,
  LearningObjectiveId,
  QuestionTemplate,
  QuestionTemplateJson,
  Subject,
  SubjectJson,
} from "@chair-flight/base/types";

const intentionallyLeftBlankPattern = /Intentionally left blank/i;
const contentPath = "./libs/question-bank/content/src";
const courseNames: Record<string, CourseName> = {
  "ATPL(A)": "ATPL_A",
  "CPL(A)": "CPL_A",
  "ATPL(H)/IR": "ATPL_H_IR",
  "ATPL(H)/VFR": "ATPL_H_VFR",
  "CPL(H)": "CPL_H",
  IR: "IR",
  "CBIR(A)": "CBIR_A",
};

export const getAllQuestionsFromLocalFs = async (
  dirPath: string = path.join(process.cwd(), contentPath, "questions"),
): Promise<QuestionTemplate[]> => {
  const files = fs.readdirSync(dirPath);
  const questions: QuestionTemplate[] = [];
  for (const file of files) {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      questions.push(...(await getAllQuestionsFromLocalFs(filePath)));
    } else if (path.extname(filePath) === ".json") {
      const jsonData = JSON.parse(
        fs.readFileSync(filePath, "utf-8"),
      ) as QuestionTemplateJson[];
      const jsonDataWithSrcLocation = jsonData.map((q) => ({
        ...q,
        srcLocation: filePath.replace(process.cwd(), ""),
      }));
      questions.push(...jsonDataWithSrcLocation);
    }
  }

  // todo reimplement this function as non blocking
  return new Promise((r) => r(questions));
};

export const getAllFlashCardsFromLocalFs = async (
  dirPath: string = path.join(process.cwd(), contentPath, "flash-cards"),
): Promise<Record<string, FlashCardContent[]>> => {
  const files = fs.readdirSync(dirPath);
  const flashCards: Record<string, FlashCardContent[]> = {};
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const jsonData = JSON.parse(
      fs.readFileSync(filePath, "utf-8"),
    ) as FlashCardContent[];
    flashCards[file.replace(".json", "")] = jsonData;
  }

  // todo reimplement this function as non blocking
  return new Promise((r) => r(flashCards));
};

export const getAllLearningObjectivesFromLocalFs = async () => {
  const fileName = path.join(process.cwd(), contentPath, "external/tk-syllabus.xlsx");
  const questions = await getAllQuestionsFromLocalFs();
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

export const getAllSubjectsFromLocalFs = async () => {
  const allLearningObjectives = await getAllLearningObjectivesFromLocalFs();
  const filePath = path.join(process.cwd(), contentPath, "subjects/subjects.json");
  const fileBuffer = fs.readFileSync(filePath, "utf-8");
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
      children: [],
    })),
  );
};
