import { z } from "zod";
import { assertType } from "@cf/base/utils";
import { questionBankNameSchema } from "./question-bank-name";
import { questionVariantDefinitionSchema } from "./question-bank-question-definition";
import { questionVariantMultipleCorrectSchema } from "./question-bank-question-multiple-correct";
import { questionVariantOneTwoSchema } from "./question-bank-question-one-two";
import { questionVariantSimpleSchema } from "./question-bank-question-simple";
import { questionVariantTrueOrFalseSchema } from "./question-bank-question-true-or-false";
import type {
  AnnexId,
  DocId,
  ExternalQuestionId,
  LearningObjectiveId,
  QuestionTemplateId,
  SubjectId,
} from "./ids";
import type { QuestionBankName } from "./question-bank-name";
import type { QuestionVariantDefinition } from "./question-bank-question-definition";
import type { QuestionVariantMultipleCorrect } from "./question-bank-question-multiple-correct";
import type { QuestionVariantOneTwo } from "./question-bank-question-one-two";
import type { QuestionVariantSimple } from "./question-bank-question-simple";
import type { QuestionVariantTrueOrFalse } from "./question-bank-question-true-or-false";
import type { IsEqual } from "@cf/base/utils";

export type QuestionVariant =
  | QuestionVariantSimple
  | QuestionVariantDefinition
  | QuestionVariantTrueOrFalse
  | QuestionVariantOneTwo
  | QuestionVariantMultipleCorrect;

export type QuestionVariantType = QuestionVariant["type"];

export type QuestionTemplate = {
  id: QuestionTemplateId;
  questionBank: QuestionBankName;
  doc: DocId;
  relatedQuestions: QuestionTemplateId[];
  externalIds: ExternalQuestionId[];
  subjects: SubjectId[];
  annexes: AnnexId[];
  learningObjectives: LearningObjectiveId[];
  explanation: string;
  srcLocation: string;
  variant: QuestionVariant;
};

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

type IQuestionTemplate = z.infer<typeof questionTemplateSchema>;
assertType<IsEqual<IQuestionTemplate, QuestionTemplate>>();
