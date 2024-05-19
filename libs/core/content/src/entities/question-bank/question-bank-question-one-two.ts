import { z } from "zod";

export const questionVariantOneTwoSchema = z.object({
  type: z.literal("one-two"),
  question: z.string().min(3),
  firstCorrectStatements: z.array(z.string().min(3)).min(1),
  firstIncorrectStatements: z.array(z.string().min(3)).min(1),
  secondCorrectStatements: z.array(z.string().min(3)).min(1),
  secondIncorrectStatements: z.array(z.string().min(3)).min(1),
});

export type QuestionVariantOneTwo = z.infer<typeof questionVariantOneTwoSchema>;
