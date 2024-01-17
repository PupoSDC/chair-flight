import type {
  LearningObjectiveId,
  QuestionTemplateId,
  QuestionVariantId,
} from "./ids";
import type { QuestionVariant } from "./question";

export type QuestionBankQuestionTemplate = {
  id: QuestionTemplateId;
  explanation: string;
  srcLocation: string;
  learningObjectives: LearningObjectiveId[];
  variants: Record<QuestionVariantId, QuestionVariant>;
};

export type QuestionBankQuestionTemplateJson = Omit<
  QuestionBankQuestionTemplate,
  "srcLocation"
>;
