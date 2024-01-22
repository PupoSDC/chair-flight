import * as fs from "node:fs/promises";
import * as path from "node:path";
import { connectQuestionBank } from "../common/connect-question-bank";
import {
  getPaths,
  readAllCoursesFromFs,
  readAllFlashcardsFromFs,
  readAllLearningObjectivesFromFs,
  readAllMediaFromFs,
  readAllQuestionsFromFs,
  readAllSubjectsFromFs,
} from "../common/parse-question-bank";
import type { ExecutorContext } from "@nx/devkit";

type ExecutorOptions = Record<string, never>;

const runExecutor = async (_: ExecutorOptions, context: ExecutorContext) => {
  const {
    projectName,
    questionsFolder,
    flashCardsFolder,
    annexesFolder,
    annexesJson,
    losJson,
    coursesJson,
    subjectsJson,
    outputDir,
    outputQuestionsJson,
    outputAnnexesDir,
    outputAnnexesJson,
    outputSubjectsJson,
    outputCoursesJson,
    outputLosJson,
    outputFlashcardsJson,
  } = getPaths({ context });

  const questions = await readAllQuestionsFromFs({
    questionsFolder,
    projectName,
  });
  const learningObjectives = await readAllLearningObjectivesFromFs({ losJson });
  const courses = await readAllCoursesFromFs({ coursesJson });
  const subjects = await readAllSubjectsFromFs({ subjectsJson });
  const annexes = await readAllMediaFromFs({ annexesJson });
  const flashcards = await readAllFlashcardsFromFs({ flashCardsFolder });

  connectQuestionBank({
    questions,
    learningObjectives,
    courses,
    subjects,
    annexes,
    flashcards,
  });

  await fs
    .rm(path.join(process.cwd(), outputDir), { recursive: true })
    .catch(() => {});

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
    fs.cp(
      path.join(process.cwd(), annexesFolder),
      path.join(process.cwd(), outputAnnexesDir),
      { recursive: true },
    ),
  ]);

  return {
    success: true,
  };
};

export default runExecutor;
