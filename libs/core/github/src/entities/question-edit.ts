import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";

export const questionEditSchema = z.object({
  question: z.object({}),
  questionBank: questionBankNameSchema,
  requestData: z.object({
    authorName: z.string().min(3).optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
    title: z.string().min(5),
    description: z.string(),
  }),
});

export type QuestionEdit = z.infer<typeof questionEditSchema>;
