import {
  getAllQuestionsFromRedis,
  getQuestionsFromRedis,
  getAllLearningObjectivesFromRedis,
  getLearningObjectivesFromRedis,
  getAllSubjectsFromRedis,
  getAllFlashCardsFromRedis,
} from "@chair-flight/providers/question-bank-redis";
import type { QuestionBankRepository } from "@chair-flight/base/types";

export type Context = {
  questionBank: QuestionBankRepository;
};

export const createContext = async (): Promise<Context> => ({
  questionBank: {
    getQuestionTemplate: async (questionId: string) => {
      return (await getQuestionsFromRedis([questionId]))[0];
    },
    getQuestionTemplates: async (questionIds: string[]) => {
      return getQuestionsFromRedis(questionIds);
    },
    getAllQuestionTemplates: async () => {
      return getAllQuestionsFromRedis();
    },
    getLearningObjective: async (learningObjectiveId: string) => {
      return (await getLearningObjectivesFromRedis([learningObjectiveId]))[0];
    },
    getLearningObjectives: async (learningObjectiveIds: string[]) => {
      return getLearningObjectivesFromRedis(learningObjectiveIds);
    },
    getAllLearningObjectives: async () => {
      return getAllLearningObjectivesFromRedis();
    },
    getAllSubjects: async () => {
      return getAllSubjectsFromRedis();
    },
    getFlashCards: async (collection: string) => {
      return (await getAllFlashCardsFromRedis())[collection];
    },
    getAllFlashCards: async () => {
      return getAllFlashCardsFromRedis();
    },
  },
});
