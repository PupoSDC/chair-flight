import type {
  QuestionId,
  QuestionOptionId,
  QuestionTemplateId,
  QuestionVariantId,
} from "./ids";

export type TestQuestionType = "multiple-choice";

export type TestQuestionMultipleChoice = {
  questionId: QuestionId;
  templateId: QuestionTemplateId;
  variantId: QuestionVariantId;
  selectedOptionId?: QuestionOptionId;
  correctOptionId: QuestionOptionId;
  seed: string;
  type: TestQuestionType;
  question: string;
  explanation: string;
  annexes: string[];
  options: Array<{
    id: QuestionOptionId;
    text: string;
    why: string;
  }>;
};

export type TestQuestion = TestQuestionMultipleChoice;
