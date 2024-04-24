import { z } from "zod";

export const questionVariantTrueOrFalseSchema = z.object({
  type: z.literal("true-or-false"),
  question: z.string().min(3),
  answer: z.boolean(),
});

export type QuestionVariantTrueOrFalse = z.infer<
  typeof questionVariantTrueOrFalseSchema
>;
