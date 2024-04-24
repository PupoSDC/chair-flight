import { z } from "zod";
import { questionBankNameSchema } from "./question-bank-ids";
import { questionVariantDefinitionSchema } from "./question-bank-question-definition";
import { questionVariantMultipleCorrectSchema } from "./question-bank-question-multiple-correct";
import { questionVariantOneTwoSchema } from "./question-bank-question-one-two";
import { questionVariantSimpleSchema } from "./question-bank-question-simple";
import { questionVariantTrueOrFalseSchema } from "./question-bank-question-true-or-false";

export const questionVariantSchema = z.union([
  questionVariantSimpleSchema,
  questionVariantDefinitionSchema,
  questionVariantTrueOrFalseSchema,
  questionVariantMultipleCorrectSchema,
  questionVariantOneTwoSchema,
]);

export const questionTemplateSchema = z.object({
  id: z.string(),
  questionBank: questionBankNameSchema,
  doc: z.string(),
  relatedQuestions: z.array(z.string()),
  externalIds: z.string().array(),
  subjects: z.array(z.string()).min(1),
  annexes: z.string().array(),
  learningObjectives: z.array(z.string()).min(1),
  explanation: z.string(),
  srcLocation: z.string().min(6),
  variant: questionVariantSchema,
});

export type QuestionTemplate = z.infer<typeof questionTemplateSchema>;
export type QuestionVariant = z.infer<typeof questionVariantSchema>;
export type QuestionVariantType = QuestionVariant["type"];
