import { applyBestMatchingLoToAllQuestions } from "@chair-flight/core/openai";
import { apiHandler } from "@chair-flight/next/server";

export default apiHandler(
  {
    post: async ({ questionBank }) => {
      await applyBestMatchingLoToAllQuestions({
        questionBank,
      });
      return "ok";
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  },
);
