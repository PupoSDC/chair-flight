import type { QuestionId } from "./ids";
import type {
  AnnexId,
  QuestionOptionId,
  QuestionTemplateId,
} from "@chair-flight/core/question-bank";

export type TestQuestionType = "multiple-choice";

export type TestQuestionMultipleChoice = {
  questionId: QuestionId;
  templateId: QuestionTemplateId;
  selectedOptionId?: QuestionOptionId;
  correctOptionId: QuestionOptionId;
  seed: string;
  type: TestQuestionType;
  question: string;
  explanation: string;
  annexes: AnnexId[];
  options: Array<{
    id: QuestionOptionId;
    text: string;
    why: string;
  }>;
};

export type TestQuestion = TestQuestionMultipleChoice;
