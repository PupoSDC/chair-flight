import { z } from "zod";
import { questionBankNameSchema } from "./question-bank-schema";
import { questionSchema } from "./question-schema";

export const questionEditSchema = z.object({
  question: questionSchema,
  questionBank: questionBankNameSchema,
  requestData: z.object({
    authorName: z.string().min(3).optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
    title: z.string().min(5),
    description: z.string(),
  }),
});
