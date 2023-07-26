import { z } from "zod";
import { questionOneTwoSchema } from "./question-variant-one-two-schema";
import { questionSimpleSchema } from "./question-variant-simple-schema";
import type { QuestionTemplate } from "@chair-flight/base/types";

export const LearningObjectiveId = z.string();

export const questionVariantSchema = z.discriminatedUnion("type", [
  questionSimpleSchema,
  questionOneTwoSchema,
]);

export const questionSchema: z.ZodType<QuestionTemplate> = z.object({
  id: z.string(),
  learningObjectives: LearningObjectiveId.array(),
  explanation: z.string(),
  srcLocation: z.string(),
  variants: z.record(questionVariantSchema),
});
