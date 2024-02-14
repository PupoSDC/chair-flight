import * as path from "node:path";
import type { ExecutorContext } from "@nx/devkit";
import { QuestionBankName } from "@cf/core/question-bank";

export const getPaths = ({ context }: { context: ExecutorContext }) => {
  const projects = context.workspace?.projects ?? {};
  const nextProjectName = "next-app";
  /** i.e.: `content-question-bank-atpl` */
  const projectName = context.projectName ?? "";
  /** i.e.: `libs/content/content-question-bank-atpl` */
  const contentRoot = projects[projectName]?.root ?? "";
  /** i.e.: `libs/content/content-question-bank-atpl/annexes` */
  const annexesFolder = path.join(contentRoot, "annexes");
  /** i.e.: `libs/content/content-question-bank-atpl/content` */
  const contentFolder = path.join(contentRoot, "content");
  /** i.e.: `libs/content/content-question-bank-atpl/flashcards` */
  const flashcardsFolder = path.join(contentRoot, "flashcards");
  /** i.e.: `apps/next-app */
  const outputProject = projects[nextProjectName]?.root ?? "";
  /** i.e.: `apps/next-app/public/content/content-question-bank-atpl` */
  const outputDir = path.join(outputProject, "public", "content", projectName);

  return {
    projectName,
    annexesFolder,
    contentFolder,
    flashcardsFolder,
    questionBank: projectName.split("-").pop() as QuestionBankName,

    /** i.e.: `libs/content/question-bank-atpl/content/subjects.json` */
    subjectsJson: path.join(contentFolder, "subjects.json"),
    /** i.e.: `libs/content/content-question-bank-atpl/content/courses.json` */
    coursesJson: path.join(contentFolder, "courses.json"),
    /** i.e.: `libs/content/content-question-bank-atpl/content/learning-objectives.json` */
    losJson: path.join(contentFolder, "learning-objectives.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl` */
    outputDir: outputDir,
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/questions.json` */
    outputQuestionsJson: path.join(outputDir, "questions.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/annexes.json` */
    outputAnnexesJson: path.join(outputDir, "annexes.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/docs.json` */
    outputDocsJson: path.join(outputDir, "docs.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/subjects.json` */
    outputSubjectsJson: path.join(outputDir, "subjects.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/courses.json` */
    outputCoursesJson: path.join(outputDir, "courses.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/learningObjectives.json` */
    outputLosJson: path.join(outputDir, "learningObjectives.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/flashcards.json` */
    outputFlashcardsJson: path.join(outputDir, "flashcards.json"),
    /** i.e.: `apps/next-app/public/content/content-question-bank-atpl/media` */
    outputMediaDir: path.join(outputDir, "media"),
  };
};
