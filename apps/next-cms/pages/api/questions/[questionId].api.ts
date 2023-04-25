import { z } from "zod";
import { questionSchema } from "@chair-flight/core/app";
import {
  apiHandler,
  getQuestionFromLocalFs,
  getQuestionsFromLocalFs,
  writeQuestionsToLocalFs,
} from "@chair-flight/next/server";

const bodySchema = z.object({
  question: questionSchema,
});

export type putBodySchema = z.infer<typeof bodySchema>;

export default apiHandler(
  {
    get: async ({ req }) =>
      getQuestionFromLocalFs(req.query["questionId"] as string),
    put: async ({ req }) => {
      const questions = await getQuestionsFromLocalFs();
      const { question } = bodySchema.parse(req.body);
      const newQuestions = questions.map((q) => {
        if (q.id === question.id) {
          return question;
        }
        return q;
      });
      writeQuestionsToLocalFs(newQuestions);
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  }
);
