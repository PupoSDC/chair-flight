import { z } from "zod";

export const questionSimpleSchema = z.object({
  type: z.literal("simple"),
  id: z.string(),
  question: z.string().min(3),
  options: z
    .object({
      id: z.string(),
      text: z.string(),
      correct: z.boolean(),
      why: z.string(),
    })
    .array()
    .min(4),
  annexes: z.string().array(),
  externalIds: z.string().array(),
  explanation: z.string(),
});
