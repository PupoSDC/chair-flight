import { z } from "zod";

export const questionSimpleSchema = z.object({
  type: z.literal("simple"),
  id: z.string(),
  question: z.string().min(3),
  options: z
    .object({
      id: z.string(),
      text: z.string().min(1),
      correct: z.boolean(),
      why: z.string(),
    })
    .array()
    // TODO should be 4
    .min(3)
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
      // TODO should be 2
      if (wrong < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 3,
          type: "array",
          inclusive: true,
          message: "At least 3 wrong answers must exist!",
        });
      }
    }),
  annexes: z.string().array(),
  externalIds: z.string().array(),
  explanation: z.string(),
});
