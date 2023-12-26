import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  getPaths,
  readAllFlashcardsFromFs,
  readAllLearningObjectivesFromFs,
  readAllMediaFromFs,
  readAllQuestionsFromFs,
  readAllSubjectsFromFs,
} from "../common/parse-question-bank";
import type { ExecutorContext } from "@nx/devkit";

type ExecutorOptions = {
  skipQuestions?: boolean;
  skipMedia?: boolean;
  skipSubjects?: boolean;
  skipLearningObjectives?: boolean;
  skipFlashcards?: boolean;
};

const runExecutor = async (
  options: ExecutorOptions,
  context: ExecutorContext,
) => {
  const {
    projectName,
    questionsFolder,
    flashCardsFolder,
    mediaPath,
    mediaJson,
    subjectsJson,
    losXlsx,
    outputDir,
    outputQuestionsJson,
    outputMediaDir,
    outputMediaJson,
    outputSubjectsJson,
    outputLosJson,
    outputFlashcardsJson,
  } = getPaths({ context });

  const questions = await readAllQuestionsFromFs({
    questionsPath: questionsFolder,
    projectName,
    ...options,
  });

  const learningObjectives = await readAllLearningObjectivesFromFs({
    questions: questions,
    loPath: losXlsx,
    ...options,
  });

  const subjects = await readAllSubjectsFromFs({
    learningObjectives,
    subjectsPath: subjectsJson,
    ...options,
  });

  const media = await readAllMediaFromFs({
    questions,
    mediaPath: mediaJson,
    ...options,
  });

  const flashcards = await readAllFlashcardsFromFs({
    flashCardsPath: flashCardsFolder,
    ...options,
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
      path.join(process.cwd(), outputMediaJson),
      JSON.stringify(media),
    ),
    fs.writeFile(
      path.join(process.cwd(), outputFlashcardsJson),
      JSON.stringify(flashcards),
    ),
    options.skipMedia
      ? Promise.resolve()
      : fs.cp(
          path.join(process.cwd(), mediaPath),
          path.join(process.cwd(), outputMediaDir),
          { recursive: true },
        ),
  ]);

  return {
    success: true,
  };
};

export default runExecutor;
