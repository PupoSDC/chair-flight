import * as fs from "node:fs/promises";
import * as path from "node:path";
import { type ExecutorContext } from "@nx/devkit";
import { NOOP } from "@cf/base/utils";
import { questionBankValidation } from "@cf/core/question-bank";
import { getAllFiles } from "../../src/executors/get-all-files";
import { getPaths } from "../../src/executors/get-paths";
import { connectQuestionBank } from "../../src/executors/question-bank-connect";
import {
  readAllCoursesFromFs,
  readAllLosFromFs,
  readAllAnnexesFromFs,
  readAllQuestionsFromFs,
  readAllSubjectsFromFs,
  readAllDocsFromFs,
  readAllFlashcardsFromFs,
} from "../../src/executors/question-bank-read";

type ExecutorOptions = Record<string, never>;

const runExecutor = async ({
  contentFolder,
  compileFolder,
  questionBank
}: ExecutorOptions) => {
  const flashcards = await readAllFlashcardsFromFs(flashcardsFolder);
  const allMedia = [...(await getAllFiles(contentFolder, ".jpg"))];

  const connectedQuestionBank = connectQuestionBank({
    questionBank,
    jsonQuestionTemplates:  await readAllQuestionsFromFs(contentFolder),
    jsonLearningObjectives: await readAllLosFromFs(losJson),
    jsonCourses: await readAllCoursesFromFs(coursesJson),
    jsonSubjects: await readAllSubjectsFromFs(subjectsJson),
    jsonAnnexes: await readAllAnnexesFromFs(contentFolder, projectName),
    jsonDocs: await readAllDocsFromFs(contentFolder),
  });

  compileQuestionBank(
    outputDir,
    
  );


  return {
    success: true,
  };
};

export default runExecutor;
