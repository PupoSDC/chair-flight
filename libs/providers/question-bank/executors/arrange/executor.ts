import {
  QuestionBankName,
} from "@cf/core/question-bank";
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

  return {
    success: true,
  };
};

export default runExecutor;
