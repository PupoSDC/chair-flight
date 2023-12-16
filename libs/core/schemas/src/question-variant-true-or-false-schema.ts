import { z } from "zod";

export const questionTrueOrFalseSchema = z.object({
  type: z.literal("true-or-false"),
  id: z.string(),
  question: z.string().min(3),
  options: z.tuple([
    z.object({
      id: z.literal("true"),
      correct: z.boolean(),
    }),
    z.object({
      id: z.literal("false"),
      correct: z.boolean(),
    }),
  ]),
  annexes: z.string().array(),
  externalIds: z.string().array(),
  explanation: z.string(),
});
