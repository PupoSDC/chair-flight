import { z } from "zod";
import { questionBankQuestionSchema } from "./question-bank-question-schema";
import { questionBankNameSchema } from "./question-bank-schema";

export const questionEditSchema = z.object({
  question: questionBankQuestionSchema,
  questionBank: questionBankNameSchema,
  requestData: z.object({
    authorName: z.string().min(3).optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
    title: z.string().min(5),
    description: z.string(),
  }),
});
