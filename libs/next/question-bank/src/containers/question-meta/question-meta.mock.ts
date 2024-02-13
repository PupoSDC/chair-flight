import { mockRetrieveAnnexesData } from "../../__mocks__/annex-search";
import { mockRetrieveLearningObjectivesData } from "../../__mocks__/search-learning-objectives";
import { mockRetrieveQuestionsData } from "../../__mocks__/search-questions";
import type { AppRouterOutput } from "@cf/trpc/server";

export const mockData: AppRouterOutput["containers"]["questions"]["getQuestionMeta"] =
  {
    annexes: mockRetrieveAnnexesData,
    learningObjectives: mockRetrieveLearningObjectivesData,
    relatedQuestions: mockRetrieveQuestionsData,
    externalIds: [],
  };
