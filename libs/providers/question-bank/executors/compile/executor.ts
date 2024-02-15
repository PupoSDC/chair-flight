import { compileQuestionBank } from "../../src/executors/question-bank-compile";
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
  flashcardsFolder,
  compileFolder,
  questionBank,
}: ExecutorOptions) => {
  const flashcards = await readAllFlashcardsFromFs(flashcardsFolder);

  const connectedQuestionBank = connectQuestionBank({
    questionBank,
    jsonQuestionTemplates: await readAllQuestionsFromFs(contentFolder),
    jsonLearningObjectives: await readAllLosFromFs(contentFolder),
    jsonCourses: await readAllCoursesFromFs(contentFolder),
    jsonSubjects: await readAllSubjectsFromFs(contentFolder),
    jsonAnnexes: await readAllAnnexesFromFs(contentFolder),
    jsonDocs: await readAllDocsFromFs(contentFolder),
  });

  await compileQuestionBank({
    contentFolder,
    compileFolder,
    flashcards,
    ...connectedQuestionBank,
  });

  return {
    success: true,
  };
};

export default runExecutor;
