import * as fs from "node:fs/promises";
import * as path from "node:path";
import { NOOP } from "@chair-flight/base/utils";
import { connectQuestionBank } from "../common/connect-question-bank";
import {
  getPaths,
  readAllCoursesFromFs,
  readAllFlashcardsFromFs,
  readAllLearningObjectivesFromFs,
  readAllAnnexesFromFs,
  readAllQuestionsFromFs,
  readAllSubjectsFromFs,
  readAllDocsFromFs,
} from "../common/parse-question-bank";
import type { ExecutorContext } from "@nx/devkit";

type ExecutorOptions = Record<string, never>;

const runExecutor = async (_: ExecutorOptions, context: ExecutorContext) => {
  const {
    projectName,
    questionsFolder,
    flashCardsFolder,
    annexesImagesFolder,
    annexesJson,
    docsFolder,
    losJson,
    coursesJson,
    subjectsJson,
    outputDir,
    outputQuestionsJson,
    outputAnnexesDir,
    outputDocsDir,
    outputAnnexesRelativeDir,
    outputAnnexesJson,
    outputSubjectsJson,
    outputCoursesJson,
    outputLosJson,
    outputFlashcardsJson,
    outputDocsJson,
  } = getPaths({ context });

  const questions = await readAllQuestionsFromFs({
    questionsFolder,
    projectName,
  });
  const learningObjectives = await readAllLearningObjectivesFromFs({ losJson });
  const courses = await readAllCoursesFromFs({ coursesJson });
  const subjects = await readAllSubjectsFromFs({ subjectsJson });
  const flashcards = await readAllFlashcardsFromFs({ flashCardsFolder });
  const docs = await readAllDocsFromFs({ docsFolder });
  const annexes = await readAllAnnexesFromFs({
    annexesJson,
    outputAnnexesRelativeDir,
  });

  connectQuestionBank({
    questions,
    learningObjectives,
    courses,
    subjects,
    annexes,
    flashcards,
    docs,
  });

  await fs
    .rm(path.join(process.cwd(), outputDir), { recursive: true })
    .catch(NOOP);

  await fs.mkdir(path.join(process.cwd(), outputDir), { recursive: true });

  await Promise.all([
    fs.writeFile(
      path.join(process.cwd(), outputQuestionsJson),
      JSON.stringify(questions),
    ),
    fs.writeFile(
      path.join(process.cwd(), outputLosJson),
      JSON.stringify(learningObjectives),
    ),
    fs.writeFile(
      path.join(process.cwd(), outputSubjectsJson),
      JSON.stringify(subjects),
    ),
    fs.writeFile(
      path.join(process.cwd(), outputCoursesJson),
      JSON.stringify(courses),
    ),
    fs.writeFile(
      path.join(process.cwd(), outputAnnexesJson),
      JSON.stringify(annexes),
    ),
    fs.writeFile(
      path.join(process.cwd(), outputFlashcardsJson),
      JSON.stringify(flashcards),
    ),
    fs.writeFile(
      path.join(process.cwd(), outputDocsJson),
      JSON.stringify(docs),
    ),
    fs.cp(
      path.join(process.cwd(), annexesImagesFolder),
      path.join(process.cwd(), outputAnnexesDir),
      { recursive: true },
    ),
    fs.cp(
      path.join(process.cwd(), docsFolder),
      path.join(process.cwd(), outputDocsDir),
      { recursive: true },
    ),
  ]);

  return {
    success: true,
  };
};

export default runExecutor;
