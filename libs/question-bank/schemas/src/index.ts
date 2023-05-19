import { z } from "zod";
import { questionOneTwoSchema } from "./question-one-two-schema";
import { questionSimpleSchema } from "./question-simple-schema";
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
