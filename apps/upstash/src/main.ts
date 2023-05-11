import {
  QuestionBankRedisRepository,
  QuestionBankLocalRepository,
} from "@chair-flight/question-bank/providers";

const updateQuestionBank = async () => {
  const redisRepository = new QuestionBankRedisRepository();
  const localRepository = new QuestionBankLocalRepository();
  const questions = await localRepository.getAllQuestionTemplates();
  const learningObjectives = await localRepository.getAllLearningObjectives();
  await redisRepository.writeQuestions(questions);
  await redisRepository.writeLearningObjectives(learningObjectives);
};

updateQuestionBank();
