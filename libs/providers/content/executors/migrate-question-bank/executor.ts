import * as fs from "node:fs/promises";
import { questionBankNameSchema } from "@cf/core/question-bank";
import { getAllFiles } from "../../src/executors/get-all-files";
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
import { Content } from "../../src/providers/content";
import type { MediaFile } from "../../src/providers/content";

type ExecutorOptions = {
  contentFolder: string;
  questionBank: string;
};

const runExecutor = async ({
  contentFolder,
  questionBank,
}: ExecutorOptions) => {
  const content = new Content();
  const images = await getAllFiles(contentFolder, ".jpg");

  const parsedFiles: MediaFile[] = [];
  for (const media of [...images]) {
    const buffer = await fs.readFile(media);
    const blob = new Blob([buffer]);
    const id = media.split("/").at(-1)?.split(".").at(0);
    if (!id) {
      throw new Error(`No ID could be inferred from ${media}`);
    }
    const file = new File([blob], id);
    parsedFiles.push({ id, file });
  }

  const mediaMap = await content.updateMedia(parsedFiles);

  const connectedBank = connectQuestionBank({
    questionBank: questionBankNameSchema.parse(questionBank),
    jsonCourses: await readAllCoursesFromFs(contentFolder),
    jsonQuestionTemplates: await readAllQuestionsFromFs(contentFolder),
    jsonAnnexes: await readAllAnnexesFromFs(contentFolder),
    jsonDocs: await readAllDocsFromFs(contentFolder),
    jsonFlashcardCollections: await readAllFlashcardsFromFs(contentFolder),
    jsonSubjects: await readAllSubjectsFromFs(contentFolder),
    jsonLearningObjectives: await readAllLosFromFs(contentFolder),
    mediaMap,
  });

  await content.updateQuestionBank(connectedBank);

  return {
    success: true,
  };
};

export default runExecutor;
