import { createQuestionTemplateEmbeddings } from "@chair-flight/core/openai";
import { apiHandler } from "@chair-flight/next/server";

export default apiHandler(
  {
    post: async ({ questionBank }) => {
      await createQuestionTemplateEmbeddings({ questionBank });
      return "ok";
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  },
);
