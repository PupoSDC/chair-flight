import { getEnvVariableOrDefault } from "@chair-flight/base/env";
import { ConfigurationError } from "@chair-flight/base/errors";
import { QuestionBankLocalRepository } from "./question-bank-file-system-repository";
import { QuestionBankRedisRepository } from "./question-bank-redis-repository";
import type { QuestionBankRepository } from "@chair-flight/base/types";

const qbProvider = getEnvVariableOrDefault("QUESTION_BANK_PROVIDER", "local");

let questionBank: QuestionBankRepository;

export const getQuestionBank = (): QuestionBankRepository => {
  if (!questionBank) {
    switch (qbProvider) {
      case "redis":
        questionBank = new QuestionBankRedisRepository();
        break;
      case "local":
        questionBank = new QuestionBankLocalRepository();
        break;
      default:
        throw new ConfigurationError(
          `Question Bank Provider not found. QUESTION_BANK_PROVIDER=${qbProvider}`,
        );
    }
  }
  return questionBank;
};
