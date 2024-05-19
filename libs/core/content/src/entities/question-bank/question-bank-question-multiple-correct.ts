import { z } from "zod";

export const questionVariantMultipleCorrectSchema = z.object({
  type: z.literal("multiple-correct"),
  question: z.string().min(3),
  options: z
    .object({
      text: z.string().min(1),
      correct: z.boolean(),
      why: z.string(),
    })
    .array()
    .min(4),
});

export type QuestionVariantMultipleCorrect = z.infer<
  typeof questionVariantMultipleCorrectSchema
>;
