import * as fs from "node:fs/promises";
import * as path from "node:path";
import { questionBankValidation } from "../../src/schemas/question-bank-validation-schema";
import { connectQuestionBank } from "../../src/executors/question-bank-connect";
import { getPaths } from "../../src/executors/get-paths";
import {
  readAllCoursesFromFs,
  readAllLosFromFs,
  readAllAnnexesFromFs,
  readAllQuestionsFromFs,
  readAllSubjectsFromFs,
  readAllDocsFromFs,
  readAllFlashcardsFromFs,
} from "../../src/executors/question-bank-read";
import type { ExecutorContext } from "@nx/devkit";
import { arrangeAnnexes, arrangeQuestions } from "../../src/executors/question-bank-arrange";
import { getAllFiles } from "../../src/executors/get-all-files";

type ExecutorOptions = Record<string, never>;

const runExecutor = async (_: ExecutorOptions, context: ExecutorContext) => {
  const {
    // Inputs
    flashcardsFolder,
    contentFolder,
    subjectsJson,
    coursesJson,
    losJson,
    annexesJson,
  } = getPaths({ context });

  const questionTemplates = await readAllQuestionsFromFs(contentFolder);
  const docs = await readAllDocsFromFs(contentFolder);
  const annexes = await readAllAnnexesFromFs(annexesJson);
  const learningObjectives = await readAllLosFromFs(losJson);
  const courses = await readAllCoursesFromFs(coursesJson);
  const subjects = await readAllSubjectsFromFs(subjectsJson);

  connectQuestionBank({
    questionTemplates,
    docs,
    annexes,
    learningObjectives,
    courses,
    subjects,
  });

  questionBankValidation.parse({
    questionTemplates,
    docs,
    annexes,
    learningObjectives,
    subjects,
    courses,
  });

  const oldQuestions = await getAllFiles(contentFolder, "questions.json");
  const oldAnnexes = await getAllFiles(contentFolder, "annexes.json");

  const annexFiles =  arrangeAnnexes({ annexes, docs });
  const questionFiles = arrangeQuestions({ questionTemplates, docs });

  await Promise.all(oldAnnexes.map((file) => fs.rm(file)));
  await Promise.all(oldQuestions.map((file) => fs.rm(file)));

  await Promise.all(
    Object.entries(annexFiles).map(([fileName, annexes]) =>
      fs.writeFile(fileName, JSON.stringify(annexes, null, 2)),
    ),
  );

  await Promise.all(
    Object.entries(questionFiles).map(([fileName, questions]) =>
      fs.writeFile(fileName, JSON.stringify(questions, null, 2)),
    ),
  );

  return {
    success: true,
  };
};

export default runExecutor;
