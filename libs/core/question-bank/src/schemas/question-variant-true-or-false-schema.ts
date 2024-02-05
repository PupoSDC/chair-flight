import { z } from "zod";

export const questionTrueOrFalseSchema = z.object({
  type: z.literal("true-or-false"),
  id: z.string(),
  question: z.string().min(3),
  answer: z.boolean(),
  annexes: z.string().array(),
  externalIds: z.string().array(),
  explanation: z.string(),
});
