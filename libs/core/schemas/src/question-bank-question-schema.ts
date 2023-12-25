import { z } from "zod";
import { questionOneTwoSchema } from "./question-variant-one-two-schema";
import { questionSimpleSchema } from "./question-variant-simple-schema";
import { questionTrueOrFalseSchema } from "./question-variant-true-or-false-schema";
import type { QuestionBankQuestionTemplate } from "@chair-flight/base/types";

export const LearningObjectiveId = z.string();

export const questionVariantSchema = z.discriminatedUnion("type", [
  questionSimpleSchema,
  questionOneTwoSchema,
  questionTrueOrFalseSchema,
]);

export const questionBankQuestionSchema: z.ZodType<QuestionBankQuestionTemplate> =
  z.object({
    id: z.string(),
    learningObjectives: LearningObjectiveId.array(),
    explanation: z.string(),
    srcLocation: z.string(),
    variants: z
      .record(questionVariantSchema)
      .refine(
        (v) => Object.keys(v).length > 0,
        "At least one variant must be defined",
      ),
  });
