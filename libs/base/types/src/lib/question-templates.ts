import type {
  LearningObjectiveId,
  QuestionOptionId,
  QuestionTemplateId,
  QuestionVariantId,
} from "./ids";

export type QuestionVariantType =
  | "simple"
  | "one-two"
  | "calculation"
  | "true-or-false";

export type QuestionVariantGeneric<T extends QuestionVariantType> = {
  type: T;
  id: QuestionVariantId;
  annexes: string[];
  externalIds: string[];
};

export type QuestionVariantSimple = QuestionVariantGeneric<"simple"> & {
  question: string;
  options: Array<{
    id: QuestionOptionId;
    text: string;
    correct: boolean;
    why: string;
  }>;
  explanation: string;
};

export type QuestionVariantTrueOrFalse =
  QuestionVariantGeneric<"true-or-false"> & {
    question: string;
    answer: boolean;
    explanation: string;
  };

export type QuestionVariantOneTwo = QuestionVariantGeneric<"one-two"> & {
  question: string;
  firstCorrectStatements: string[];
  firstIncorrectStatements: string[];
  secondCorrectStatements: string[];
  secondIncorrectStatements: string[];
  explanation: string;
};

export type QuestionVariantCalculation =
  QuestionVariantGeneric<"calculation"> & {
    question: string;
    explanation: string;
    correct: {
      function: string;
      why: string;
    };
    functionIncorrect: Array<{
      function: string;
      why: string;
    }>;
  };

export type QuestionVariant =
  | QuestionVariantOneTwo
  | QuestionVariantSimple
  | QuestionVariantTrueOrFalse
  | QuestionVariantCalculation;

export type QuestionTemplate = {
  id: QuestionTemplateId;
  explanation: string;
  srcLocation: string;
  learningObjectives: LearningObjectiveId[];
  variants: Record<QuestionVariantId, QuestionVariant>;
};

export type QuestionTemplateJson = Omit<QuestionTemplate, "srcLocation">;
