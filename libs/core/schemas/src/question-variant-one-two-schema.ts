import { z } from "zod";

export const questionOneTwoSchema = z.object({
  type: z.literal("one-two"),
  id: z.string(),
  question: z.string(),
  firstCorrectStatements: z.string().array(),
  firstIncorrectStatements: z.string().array(),
  secondCorrectStatements: z.string().array(),
  secondIncorrectStatements: z.string().array(),
  annexes: z.string().array(),
  externalIds: z.string().array(),
  explanation: z.string(),
});
