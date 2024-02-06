import * as fs from "node:fs/promises";
import * as path from "node:path";
import { type ExecutorContext } from "@nx/devkit";
import { NOOP } from "@chair-flight/base/utils";
import { questionBankValidation } from "@chair-flight/core/question-bank";
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

const runExecutor = async (_: ExecutorOptions, context: ExecutorContext) => {
  const {
    // Inputs
    projectName,
    flashcardsFolder,
    contentFolder,
    subjectsJson,
    coursesJson,
    losJson,

    // Outputs
    outputDir,
    outputQuestionsJson,
    outputAnnexesJson,
    outputDocsJson,
    outputSubjectsJson,
    outputCoursesJson,
    outputLosJson,
    outputFlashcardsJson,
    outputMediaDir,
  } = getPaths({ context });

  const questionTemplates = await readAllQuestionsFromFs(contentFolder);
  const docs = await readAllDocsFromFs(contentFolder);
  const annexes = await readAllAnnexesFromFs(contentFolder, projectName);
  const learningObjectives = await readAllLosFromFs(losJson);
  const courses = await readAllCoursesFromFs(coursesJson);
  const subjects = await readAllSubjectsFromFs(subjectsJson);
  const flashcards = await readAllFlashcardsFromFs(flashcardsFolder);
  const allMedia = [...(await getAllFiles(contentFolder, ".jpg"))];

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

  await fs
    .rm(path.join(process.cwd(), outputDir), { recursive: true })
    .catch(NOOP);

  await fs.mkdir(path.join(process.cwd(), outputMediaDir), { recursive: true });

  await Promise.all([
    fs.writeFile(
      path.join(process.cwd(), outputQuestionsJson),
      JSON.stringify(questionTemplates),
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
    ...allMedia.map(async (media) => {
      const mediaFile = await fs.readFile(media);
      await fs.writeFile(
        path.join(process.cwd(), outputMediaDir, path.basename(media)),
        mediaFile,
      );
    }),
  ]);

  return {
    success: true,
  };
};

export default runExecutor;
