import { z } from "zod";

export const questionVariantSimpleSchema = z.object({
  type: z.literal("simple"),
  question: z.string().min(3),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1),
        correct: z.boolean(),
        why: z.string(),
      }),
    )
    .min(4)
    .superRefine((data, ctx) => {
      const correct = data.filter((d) => d.correct).length;
      const wrong = data.filter((d) => !d.correct).length;
      if (correct < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          type: "array",
          inclusive: true,
          message: "At least one correct answer must exist!",
        });
      }
      if (wrong < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 3,
          type: "array",
          inclusive: true,
          message: "At least 3 wrong answers must exist!",
        });
      }
    }),
});

export type QuestionVariantSimple = z.infer<typeof questionVariantSimpleSchema>;
