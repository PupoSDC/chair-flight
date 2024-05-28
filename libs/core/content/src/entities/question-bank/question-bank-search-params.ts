import { z } from "zod";
import { questionBankNameSchema } from "./question-bank-ids";

export const QuestionBankSearchParamsSchema = z.object({
  q: z.string(),
  limit: z.number().min(1).max(50),
  cursor: z.number().default(0),
  questionBank: questionBankNameSchema.optional(),
});

export type QuestionBankSearchParams = z.infer<
  typeof QuestionBankSearchParamsSchema
>;
