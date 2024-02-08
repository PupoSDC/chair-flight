import { z } from "zod";
import {
  questionBankNameSchema,
  questionTemplateSchema,
} from "@chair-flight/core/question-bank";

export const editQuestionsPrMetaSchema = z.object({
  authorName: z.string().min(3).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  title: z.string().min(5),
  description: z.string().min(5),
});

export const editQuestionsPrSchema = z.object({
  meta: editQuestionsPrMetaSchema,
  questionBank: questionBankNameSchema,
  questions: z.array(questionTemplateSchema),
  deletedQuestions: z.array(questionTemplateSchema),
});

export type EditQuestionsPr = z.infer<typeof editQuestionsPrSchema>;
