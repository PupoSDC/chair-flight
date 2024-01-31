import { z } from "zod";
import { questionDefinitionSchema } from "./question-variant-definition";
import { questionOneTwoSchema } from "./question-variant-one-two-schema";
import { questionSimpleSchema } from "./question-variant-simple-schema";
import { questionTrueOrFalseSchema } from "./question-variant-true-or-false-schema";
import type { QuestionTemplate } from "@chair-flight/base/types";

export const LearningObjectiveId = z.string();

export const questionVariantSchema = z.discriminatedUnion("type", [
  questionSimpleSchema,
  questionOneTwoSchema,
  questionTrueOrFalseSchema,
  questionDefinitionSchema,
]);

export const questionBankQuestionSchema: z.ZodType<QuestionTemplate> = z.object(
  {
    id: z.string(),
    learningObjectives: LearningObjectiveId.array(),
    explanation: z.string(),
    srcLocation: z.string(),
    subject: z.string(),
    variants: z
      .record(questionVariantSchema)
      .refine(
        (v) => Object.keys(v).length > 0,
        "At least one variant must be defined",
      ),
  },
);
