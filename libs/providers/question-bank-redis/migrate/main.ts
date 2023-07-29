import {
  getAllQuestionsFromLocalFs,
  getAllFlashCardsFromLocalFs,
  getAllLearningObjectivesFromLocalFs,
  getAllSubjectsFromLocalFs,
} from "@chair-flight/providers/question-bank-local";
import {
  writeQuestionsToRedis,
  writeLearningObjectivesToRedis,
  writeSubjectsToRedis,
  writeFlashCardsToRedis,
} from "../src/functions/question-bank";
import { validateQuestions } from "./validation/validate-questions";

const writeLocalToRemoteQuestionBank = async () => {
  const questions = await getAllQuestionsFromLocalFs();
  const flashCards = await getAllFlashCardsFromLocalFs();
  const learningObjectives = await getAllLearningObjectivesFromLocalFs();
  const subjects = await getAllSubjectsFromLocalFs();
  console.log("read the entire question bank");

  validateQuestions(questions);

  await writeQuestionsToRedis(questions);
  await writeLearningObjectivesToRedis(learningObjectives);
  await writeFlashCardsToRedis(flashCards);
  await writeSubjectsToRedis(subjects);
};

writeLocalToRemoteQuestionBank();
