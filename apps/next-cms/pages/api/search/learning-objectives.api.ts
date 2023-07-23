import {
  makeSearchLearningObjectives,
  searchQueryValidation,
} from "@chair-flight/core/app";
import { apiHandler } from "@chair-flight/next/server";
import type { SearchLearningObjectives } from "@chair-flight/core/app";

let search: SearchLearningObjectives;

export default apiHandler(
  {
    get: async ({ req, questionBank }) => {
      search ??= await makeSearchLearningObjectives(questionBank);
      const inputs = searchQueryValidation.parse(req.query);
      return search(inputs);
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  },
);
