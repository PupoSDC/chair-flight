import * as fs from "node:fs/promises";
import * as path from "node:path";
import { makeMap } from "@cf/base/utils";
import {
  QuestionBankName,
  questionBankValidation,
} from "@cf/core/question-bank";
import { getAllFiles } from "../../src/executors/get-all-files";
import { getPaths } from "../../src/executors/get-paths";
import {
  arrangeAnnexes,
  arrangeQuestions,
} from "../../src/executors/question-bank-arrange";
import { connectQuestionBank } from "../../src/executors/question-bank-connect";
import {
  readAllCoursesFromFs,
  readAllLosFromFs,
  readAllAnnexesFromFs,
  readAllQuestionsFromFs,
  readAllSubjectsFromFs,
  readAllDocsFromFs,
} from "../../src/executors/question-bank-read";
import {
  writeAnnexes,
  writeQuestionTemplates,
} from "../../src/executors/question-bank-write";
import type { ExecutorContext } from "@nx/devkit";

type ExecutorOptions = {
  contentFolder: string;
  questionBank: QuestionBankName;
};

const runExecutor = async ({
  contentFolder,
  questionBank,
}: ExecutorOptions) => {
  const { questionTemplates, annexes } = connectQuestionBank({
    questionBank,
    jsonQuestionTemplates: await readAllQuestionsFromFs(contentFolder),
    jsonLearningObjectives: await readAllLosFromFs(contentFolder),
    jsonCourses: await readAllCoursesFromFs(contentFolder),
    jsonSubjects: await readAllSubjectsFromFs(contentFolder),
    jsonAnnexes: await readAllAnnexesFromFs(contentFolder),
    jsonDocs: await readAllDocsFromFs(contentFolder),
  });

  await writeQuestionTemplates(contentFolder, questionTemplates);
  await writeAnnexes(contentFolder, annexes);

  //  const annexFiles = arrangeAnnexes({ annexes, docs });
  //  const questionFiles = arrangeQuestions({ questionTemplates, docs });

  // writeQuestionTemplates(contentFolder, questionTemplates);

  /** 
  const mediaMap = makeMap(
    [...(await getAllFiles(contentFolder, ".jpg"))],
    (p) => p.split("/").pop()?.split(".")[0] ?? "",
    (p) => p,
  );
  await Promise.all(
    Object.values(annexFiles).map(({ fileName, annexes }) =>
      fs.writeFile(fileName, JSON.stringify(annexes, null, 2)),
    ),
  );

  await Promise.all(
    Object.values(questionFiles).map(({ fileName, questions }) =>
      fs.writeFile(fileName, JSON.stringify(questions, null, 2)),
    ),
  );

  await Promise.all(
    Object.values(annexFiles).flatMap(({ annexes, fileName }) =>
      annexes.map((annex) => {
        const origin = mediaMap[annex.id];
        const folderName = fileName.replaceAll("annexes.json", "annexes");
        const destination = path.join(
          folderName,
          `${annex.id}.${annex.format}`,
        );
        if (!mediaMap[annex.id]) return Promise.resolve(undefined);
        return fs.rename(origin, destination);
      }),
    ),
  );*/

  return {
    success: true,
  };
};

export default runExecutor;
