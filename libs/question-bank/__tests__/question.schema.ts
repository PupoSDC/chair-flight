import { z } from "zod";
import type { QuestionTemplate } from "../src/types";

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
  learningObjectives: z.string().array(),
  explanation: z.string(),
});

export const questionSimpleSchema = z.object({
  type: z.literal("simple"),
  id: z.string(),
  question: z.string(),
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
  learningObjectives: z.string().array(),
  explanation: z.string(),
});

export const questionSchema: z.ZodType<QuestionTemplate> = z.object({
  id: z.string(),
  learningObjectives: z.string().array(),
  explanation: z.string(),
  srcLocation: z.string(),
  variants: z.record(
    z.discriminatedUnion("type", [questionSimpleSchema, questionOneTwoSchema])
  ),
});
