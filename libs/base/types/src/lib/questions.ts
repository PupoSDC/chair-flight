import type {
  QuestionId,
  QuestionOptionId,
  QuestionTemplateId,
  QuestionVariantId,
} from "./ids";

export type QuestionType = "multiple-choice";

export type QuestionMultipleChoice = {
  questionId: QuestionId;
  templateId: QuestionTemplateId;
  variantId: QuestionVariantId;
  selectedOptionId?: QuestionOptionId;
  correctOptionId: QuestionOptionId;
  seed: string;
  type: QuestionType;
  question: string;
  explanation: string;
  annexes: string[];
  options: Array<{
    id: QuestionOptionId;
    text: string;
    why: string;
  }>;
};

export type Question = QuestionMultipleChoice;
