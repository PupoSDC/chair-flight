import { questionBankNameSchema } from "@cf/core/content";
import { connectQuestionBank } from "../../src/executors/question-bank-connect";
import {
  readAllAnnexesFromFs,
  readAllCoursesFromFs,
  readAllDocsFromFs,
  readAllFlashcardsFromFs,
  readAllLosFromFs,
  readAllQuestionsFromFs,
  readAllSubjectsFromFs,
} from "../../src/executors/question-bank-read";
import {
  writeAnnexes,
  writeQuestionTemplates,
} from "../../src/executors/question-bank-write";

type ExecutorOptions = {
  contentFolder: string;
  questionBank: string;
};

const runExecutor = async ({
  contentFolder,
  questionBank,
}: ExecutorOptions) => {
  const { questionTemplates, annexes } = connectQuestionBank({
    questionBank: questionBankNameSchema.parse(questionBank),
    jsonCourses: await readAllCoursesFromFs(contentFolder),
    jsonQuestionTemplates: await readAllQuestionsFromFs(contentFolder),
    jsonAnnexes: await readAllAnnexesFromFs(contentFolder),
    jsonDocs: await readAllDocsFromFs(contentFolder),
    jsonFlashcardCollections: await readAllFlashcardsFromFs(contentFolder),
    jsonSubjects: await readAllSubjectsFromFs(contentFolder),
    jsonLearningObjectives: await readAllLosFromFs(contentFolder),
    mediaMap: {},
  });

  await writeQuestionTemplates(contentFolder, questionTemplates);
  await writeAnnexes(contentFolder, annexes);

  return {
    success: true,
  };
};

export default runExecutor;
