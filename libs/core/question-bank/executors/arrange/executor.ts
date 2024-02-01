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
import { makeMap } from "@chair-flight/base/utils";

type ExecutorOptions = Record<string, never>;

const runExecutor = async (_: ExecutorOptions, context: ExecutorContext) => {
  const {
    flashcardsFolder,
    contentFolder,
    subjectsJson,
    coursesJson,
    losJson,
    annexesJson: annexRoot,
  } = getPaths({ context });

  const questionTemplates = await readAllQuestionsFromFs(contentFolder);
  const docs = await readAllDocsFromFs(contentFolder);
  const annexes = await readAllAnnexesFromFs(contentFolder);
  const learningObjectives = await readAllLosFromFs(losJson);
  const courses = await readAllCoursesFromFs(coursesJson);
  const subjects = await readAllSubjectsFromFs(subjectsJson);

  const mediaMap = makeMap(
    [...await getAllFiles(contentFolder, ".jpg")],
    (p) => p.split("/").pop()?.split(".")[0] ?? "",
    (p) => p,
  );

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


  const annexFiles =  arrangeAnnexes({ annexes, docs });
  const questionFiles = arrangeQuestions({ questionTemplates, docs });

  console.log(Object.entries(annexFiles).map(([k, v]) => k));


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
  /** 
  await Promise.all(Object
    .entries(annexFiles)
    .flatMap(([sourceName, annexes]) => annexes.map((annex) => {
        const origin = mediaMap[annex.id];
        const folderName = sourceName.replaceAll("annexes.json", "annexes");
        const destination = path.join(folderName, `${annex.id}.${annex.format}`);
        if (!mediaMap[annex.id]) return Promise.resolve(undefined);
        return fs.rename(origin, destination);
    })));
  */
  return {
    success: true,
  };
};

export default runExecutor;
