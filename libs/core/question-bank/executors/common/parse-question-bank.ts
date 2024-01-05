import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as XLSX from "xlsx";
import type {
  QuestionBankQuestionTemplate,
  QuestionBankQuestionTemplateJson,
  QuestionBankLearningObjective,
  QuestionBankMediaJson,
  CourseName,
  LearningObjectiveId,
  QuestionBankMedia,
  QuestionBankSubjectJson,
  QuestionBankSubject,
  QuestionBankFlashcardContent,
  QuestionBankFlashcardCollection,
} from "@chair-flight/base/types";
import type { ExecutorContext } from "@nx/devkit";

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

export const getPaths = ({ context }: { context: ExecutorContext }) => {
  const projects = context.workspace?.projects ?? {};
  const nextProjectName = "next-app";
  /** i.e.: `content-question-bank-atpl` */
  const projectName = context.projectName ?? "";
  /** i.e.: `libs/content/question-bank-atpl` */
  const contentRoot = projects[projectName]?.root ?? "";
  /** i.e.: `libs/content/question-bank-atpl/content/media` */
  const mediaPath = path.join(contentRoot, "media");
  /** i.e.: `apps/next-app */
  const outputProject = projects[nextProjectName]?.root ?? "";
  /** i.e.: `apps/next-app/public/content/question-bank-atpl` */
  const outputDir = path.join(outputProject, "public", "content", projectName);

  return {
    /** i.e.: `content-question-bank-atpl` */
    projectName: projectName,
    /** i.e.: `libs/content/question-bank-atpl` */
    questionsFolder: path.join(contentRoot, "questions"),
    /** i.e.: `libs/content/question-bank-atpl/content/flashcards` */
    flashCardsFolder: path.join(contentRoot, "flashcards"),
    /** i.e.: `libs/content/question-bank-atpl/content/media` */
    mediaPath: path.join(contentRoot, "media"),
    /** i.e.: `libs/content/question-bank-atpl/content/media/media.json` */
    mediaJson: path.join(mediaPath, "media.json"),
    /** i.e.: `libs/content/question-bank-atpl/content/subjects/subjects.json` */
    subjectsJson: path.join(contentRoot, "subjects", "subjects.json"),
    /** i.e.: `libs/content/question-bank-atpl/content/subjects/tk-syllabus.xlsx` */
    losXlsx: path.join(contentRoot, "subjects", "tk-syllabus.xlsx"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl` */
    outputDir: outputDir,
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/questions.json` */
    outputQuestionsJson: path.join(outputDir, "questions.json"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/media` */
    outputMediaDir: path.join(outputDir, "media"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/media.json` */
    outputMediaJson: path.join(outputDir, "media.json"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/subjects.json` */
    outputSubjectsJson: path.join(outputDir, "subjects.json"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/learningObjectives.json` */
    outputLosJson: path.join(outputDir, "learningObjectives.json"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/flashcards.json` */
    outputFlashcardsJson: path.join(outputDir, "flashcards.json"),
  };
};

export const readAllQuestionsFromFs = async ({
  questionsPath,
  skipQuestions,
  projectName,
}: {
  skipQuestions?: boolean;
  questionsPath: string;
  projectName: string;
}): Promise<QuestionBankQuestionTemplate[]> => {
  if (skipQuestions) return [];
  const files = await fs.readdir(questionsPath);
  const questions: QuestionBankQuestionTemplate[] = [];
  for (const file of files) {
    const filePath = path.join(questionsPath, file);

    if ((await fs.stat(filePath)).isDirectory()) {
      questions.push(
        ...(await readAllQuestionsFromFs({
          questionsPath: filePath,
          skipQuestions,
          projectName,
        })),
      );
    } else if (path.extname(filePath) === ".json") {
      const json = await fs.readFile(filePath, "utf-8");
      const jsonData = JSON.parse(json) as QuestionBankQuestionTemplateJson[];
      const jsonDataWithSrcLocation = jsonData.map((q) => ({
        ...q,
        srcLocation: filePath.replace(process.cwd(), ""),
      }));
      jsonDataWithSrcLocation.forEach((q) => {
        Object.keys(q.variants).forEach((id) => {
          q.variants[id].annexes = q.variants[id].annexes.map((a) =>
            a.replace("/content/media", `/content/${projectName}/media`),
          );
        });
      });

      questions.push(...jsonDataWithSrcLocation);
    }
  }

  return questions;
};

export const readAllLearningObjectivesFromFs = async ({
  questions,
  loPath,
  skipLearningObjectives,
}: {
  questions: QuestionBankQuestionTemplate[];
  loPath: string;
  skipLearningObjectives?: boolean;
}) => {
  if (skipLearningObjectives) return [];
  const workbook = XLSX.readFile(loPath);
  const sheetNames = workbook.SheetNames;
  const learningObjectivesMap = sheetNames
    .slice(2)
    .flatMap<QuestionBankLearningObjective>((name) => {
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[name]) as Record<
        string,
        string
      >[];
      return sheet.map<QuestionBankLearningObjective>((row) => {
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
          // TODO - add href
          href: "",
        };
      });
    })
    .filter((lo) => !intentionallyLeftBlankPattern.test(lo.text))
    .reduce<Record<LearningObjectiveId, QuestionBankLearningObjective>>(
      (s, k) => {
        if (!k.contentId) return s;
        s[k.contentId] = k;
        return s;
      },
      {},
    );

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

export const readAllSubjectsFromFs = async ({
  learningObjectives,
  subjectsPath,
  skipSubjects,
}: {
  learningObjectives: QuestionBankLearningObjective[];
  subjectsPath: string;
  skipSubjects?: boolean;
}) => {
  if (skipSubjects) return [];
  const fileBuffer = await fs.readFile(subjectsPath, "utf-8");
  const subjects = JSON.parse(fileBuffer) as QuestionBankSubjectJson[];

  return learningObjectives.reduce<QuestionBankSubject[]>(
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

export const readAllMediaFromFs = async ({
  questions,
  mediaPath,
  skipMedia,
}: {
  questions: QuestionBankQuestionTemplate[];
  mediaPath: string;
  skipMedia?: boolean;
}): Promise<QuestionBankMedia[]> => {
  if (skipMedia) return [];
  const file = await fs.readFile(mediaPath, "utf-8");
  const json = JSON.parse(file) as QuestionBankMediaJson[];
  const allMedia = json.map<QuestionBankMedia>((m) => ({
    ...m,
    questions: [],
    variants: [],
    learningObjectives: [],
  }));

  // connect questions to media
  questions.forEach((q) => {
    Object.values(q.variants).forEach((v) => {
      v.annexes.forEach((a) => {
        const annex = a.split("/").pop()?.split(".")[0] ?? "";
        const media = allMedia.find((m) => m.id === annex);
        if (media) {
          media.questions = [...new Set([...media.questions, q.id])];
          media.variants = [...new Set([...media.variants, v.id])];
          media.learningObjectives = [
            ...new Set([...media.learningObjectives, ...q.learningObjectives]),
          ];
        }
      });
    });
  });

  return allMedia;
};

export const readAllFlashcardsFromFs = async ({
  flashCardsPath,
  skipFlashcards,
}: {
  flashCardsPath: string;
  skipFlashcards?: boolean;
}): Promise<QuestionBankFlashcardCollection[]> => {
  if (skipFlashcards) return [];
  const flashcardFiles = await fs.readdir(flashCardsPath);
  const flashcards: QuestionBankFlashcardCollection[] = [];
  for (const file of flashcardFiles) {
    const filePath = path.join(flashCardsPath, file);
    const jsonString = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(jsonString) as QuestionBankFlashcardContent[];
    flashcards.push({
      id: file.replace(".json", ""),
      flashcards: jsonData,
      title: file
        .replace(".json", "")
        .split("-")
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join(" "),
    });
  }
  return flashcards;
};
