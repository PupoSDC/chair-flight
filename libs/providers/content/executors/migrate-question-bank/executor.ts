import { questionBankNameSchema } from "@cf/core/question-bank";
import { Content } from "../../src/content";
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

type ExecutorOptions = {
  contentFolder: string;
  questionBank: string;
};

const runExecutor = async ({
  contentFolder,
  questionBank,
}: ExecutorOptions) => {
  const content = new Content();

  await content.updateQuestionBank(
    connectQuestionBank({
      questionBank: questionBankNameSchema.parse(questionBank),
      jsonCourses: await readAllCoursesFromFs(contentFolder),
      jsonQuestionTemplates: await readAllQuestionsFromFs(contentFolder),
      jsonAnnexes: await readAllAnnexesFromFs(contentFolder),
      jsonDocs: await readAllDocsFromFs(contentFolder),
      jsonFlashcardCollections: await readAllFlashcardsFromFs(contentFolder),
      jsonSubjects: await readAllSubjectsFromFs(contentFolder),
      jsonLearningObjectives: await readAllLosFromFs(contentFolder),
    }),
  );

  return {
    success: true,
  };
};

export default runExecutor;
