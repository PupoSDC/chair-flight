import { searchQuestions, searchQueryValidation } from "@chair-flight/core/app";
import { apiHandler } from "@chair-flight/next/server";

export default apiHandler(
  {
    get: async ({ req, questionBank }) => {
      const inputs = searchQueryValidation.parse(req.query);
      const results = await searchQuestions(questionBank, inputs);
      return results;
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  },
);
