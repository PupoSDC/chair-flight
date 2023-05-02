import { mergeQuestionsWithHighSimilarity } from "@chair-flight/core/openai";
import { apiHandler } from "@chair-flight/next/server";

export default apiHandler(
  {
    post: async ({ questionBank }) => {
      return await mergeQuestionsWithHighSimilarity({ questionBank });
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  }
);
