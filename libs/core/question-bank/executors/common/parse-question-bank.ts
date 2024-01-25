import * as fs from "node:fs/promises";
import * as path from "node:path";
import type {
  QuestionBankQuestionTemplate,
  QuestionBankQuestionTemplateJson,
  QuestionBankLearningObjective,
  QuestionBankAnnexesJson,
  QuestionBankAnnexes,
  QuestionBankSubjectJson,
  QuestionBankFlashcardContent,
  QuestionBankFlashcardCollection,
  QuestionBankLearningObjectiveJson,
  QuestionBankCourseJson,
  QuestionBankCourse,
  QuestionBankSubject,
} from "@chair-flight/base/types";
import type { ExecutorContext } from "@nx/devkit";

const exists = async (f: string) => {
  try {
    await fs.stat(f);
    return true;
  } catch {
    return false;
  }
};

export const getPaths = ({ context }: { context: ExecutorContext }) => {
  const projects = context.workspace?.projects ?? {};
  const nextProjectName = "next-app";
  /** i.e.: `content-question-bank-atpl` */
  const projectName = context.projectName ?? "";
  /** i.e.: `libs/content/content-question-bank-atpl` */
  const contentRoot = projects[projectName]?.root ?? "";
  /** i.e.: `libs/content/content-question-bank-atpl/content/annexes` */
  const annexesFolder = path.join(contentRoot, "annexes");
  /** i.e.: `apps/next-app */
  const outputProject = projects[nextProjectName]?.root ?? "";
  /** i.e.: `apps/next-app/public/content/content-question-bank-atpl` */
  const outputDir = path.join(outputProject, "public", "content", projectName);

  return {
    /** i.e.: `content-question-bank-atpl` */
    projectName: projectName,
    /** i.e.: `libs/content/content-question-bank-atpl` */
    questionsFolder: path.join(contentRoot, "questions"),
    /** i.e.: `libs/content/content-question-bank-atpl/content/flashcards` */
    flashCardsFolder: path.join(contentRoot, "flashcards"),
    /** i.e.: `libs/content/content-question-bank-atpl/content/annexes` */
    annexesFolder: path.join(contentRoot, "annexes"),
    /** i.e.: `libs/content/content-question-bank-atpl/content/annexes/images` */
    annexesImagesFolder: path.join(contentRoot, "annexes", "images"),
    /** i.e.: `libs/content/question-bank-atpl/content/annexes/annexes.json` */
    annexesJson: path.join(annexesFolder, "annexes.json"),
    /** i.e.: `libs/content/question-bank-atpl/content/docs` */
    docsFolder:  path.join(contentRoot, "docs"),
    /** i.e.: `libs/content/question-bank-atpl/content/subjects/subjects.json` */
    subjectsJson: path.join(contentRoot, "subjects", "subjects.json"),
    /** i.e.: `libs/content/content-question-bank-atpl/content/subjects/courses.json` */
    coursesJson: path.join(contentRoot, "subjects", "courses.json"),
    /** i.e.: `libs/content/content-question-bank-atpl/content/subjects/learning-objectives.json` */
    losJson: path.join(contentRoot, "subjects", "learning-objectives.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl` */
    outputDir: outputDir,
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/questions.json` */
    outputQuestionsJson: path.join(outputDir, "questions.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/annexes` */
    outputAnnexesDir: path.join(outputDir, "annexes"),
    /** i.e.: `/content/content-question-bank-atpl/annexes` */
    outputAnnexesRelativeDir: path.join("content", projectName, "annexes"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/annexes.json` */
    outputAnnexesJson: path.join(outputDir, "annexes.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/subjects.json` */
    outputSubjectsJson: path.join(outputDir, "subjects.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/courses.json` */
    outputCoursesJson: path.join(outputDir, "courses.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/learningObjectives.json` */
    outputLosJson: path.join(outputDir, "learningObjectives.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/flashcards.json` */
    outputFlashcardsJson: path.join(outputDir, "flashcards.json"),
  };
};

export const readAllQuestionsFromFs = async ({
  questionsFolder,
  projectName,
}: {
  questionsFolder: string;
  projectName: string;
}): Promise<QuestionBankQuestionTemplate[]> => {
  const files = await fs.readdir(questionsFolder);
  const questions: QuestionBankQuestionTemplate[] = [];
  for (const file of files) {
    const filePath = path.join(questionsFolder, file);

    if ((await fs.stat(filePath)).isDirectory()) {
      questions.push(
        ...(await readAllQuestionsFromFs({
          questionsFolder: filePath,
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
            a.replace("/content/annexes", `/content/${projectName}/annexes`),
          );
        });
      });

      questions.push(...jsonDataWithSrcLocation);
    }
  }

  return questions;
};

export const readAllLearningObjectivesFromFs = async ({
  losJson,
}: {
  losJson: string;
}): Promise<QuestionBankLearningObjective[]> => {
  const fileBuffer = await fs.readFile(losJson, "utf-8");
  const los = JSON.parse(fileBuffer) as QuestionBankLearningObjectiveJson[];

  return los.map((lo) => ({
    ...lo,
    questions: [],
    nestedQuestions: [],
  }));
};

export const readAllSubjectsFromFs = async ({
  subjectsJson,
}: {
  subjectsJson: string;
}): Promise<QuestionBankSubject[]> => {
  const fileBuffer = await fs.readFile(subjectsJson, "utf-8");
  const subjects = JSON.parse(fileBuffer) as QuestionBankSubjectJson[];

  return subjects.map((s) => ({
    ...s,
    numberOfQuestions: 0,
  }));
};

export const readAllCoursesFromFs = async ({
  coursesJson,
}: {
  coursesJson: string;
}): Promise<QuestionBankCourse[]> => {
  const fileBuffer = await fs.readFile(coursesJson, "utf-8");
  const courses = JSON.parse(fileBuffer) as QuestionBankCourseJson[];
  return courses;
};

export const readAllAnnexesFromFs = async ({
  annexesJson,
  outputAnnexesRelativeDir,
}: {
  annexesJson: string;
  outputAnnexesRelativeDir: string;
}): Promise<QuestionBankAnnexes[]> => {
  const file = await fs.readFile(annexesJson, "utf-8");
  const json = JSON.parse(file) as QuestionBankAnnexesJson[];
  const allMedia = json.map<QuestionBankAnnexes>((m) => ({
    ...m,
    href: `/${outputAnnexesRelativeDir}/${m.id}.${m.format}`,
    subjects: [],
    questions: [],
    variants: [],
    learningObjectives: [],
  }));

  return allMedia;
};

export const readAllFlashcardsFromFs = async ({
  flashCardsFolder,
}: {
  flashCardsFolder: string;
}): Promise<QuestionBankFlashcardCollection[]> => {
  if (!exists(flashCardsFolder)) return [];
  const files = await fs.readdir(flashCardsFolder);
  const flashcardFiles = files.filter((f) => f.endsWith(".json"));
  const flashcards: QuestionBankFlashcardCollection[] = [];
  for (const file of flashcardFiles) {
    const filePath = path.join(flashCardsFolder, file);
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
