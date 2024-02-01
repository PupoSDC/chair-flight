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

    // Outputs
    outputDir,
    outputQuestionsJson,
    outputAnnexesDir,
    outputAnnexesJson,
    outputDocsDir,
    outputDocsJson,
    outputSubjectsJson,
    outputCoursesJson,
    outputLosJson,
    outputFlashcardsJson,
  } = getPaths({ context });

  const questionTemplates = await readAllQuestionsFromFs(contentFolder);
  const docs = await readAllDocsFromFs(contentFolder);
  const annexes = await readAllAnnexesFromFs(annexesJson);
  const learningObjectives = await readAllLosFromFs(losJson);
  const courses = await readAllCoursesFromFs(coursesJson);
  const subjects = await readAllSubjectsFromFs(subjectsJson);
  const flashcards = await readAllFlashcardsFromFs(flashcardsFolder);

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
    .catch(() => {});

  await fs.mkdir(path.join(process.cwd(), outputDir), { recursive: true });

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
    //fs.cp(
    //  path.join(process.cwd(), annexesImagesFolder),
    //  path.join(process.cwd(), outputAnnexesDir),
    //  { recursive: true },
    //),
    //fs.cp(
    //  path.join(process.cwd(), docsFolder),
    //  path.join(process.cwd(), outputDocsDir),
    //  { recursive: true },
    //),
  ]);

  return {
    success: true,
  };
};

export default runExecutor;
