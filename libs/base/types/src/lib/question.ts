import type { AnnexId, QuestionOptionId, QuestionVariantId } from "./ids";

export type QuestionVariantType =
  | "simple"
  | "definition"
  | "true-or-false" 
  | "one-two"
  | "multiple-correct"

export type QuestionVariantGeneric<T extends QuestionVariantType> = {
  type: T;
  id: QuestionVariantId;
  annexes: AnnexId[];
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

export type QuestionVariantDefinition = QuestionVariantGeneric<"definition"> & {
  question: string;
  options: Array<{
    id: QuestionOptionId; 
    term: string, 
    definition: string
  }>;
  fakeOptions:  Array<{
    id: QuestionOptionId; 
    definition: string, 
  }>;
}

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

export type QuestionVariantMultipleCorrect = QuestionVariantGeneric<"multiple-correct"> & {
  question: string;
  options: Array<{
    text: string;
    correct: boolean;
    why: string;
  }>;
}

export type QuestionVariant =
  | QuestionVariantSimple
  | QuestionVariantDefinition
  | QuestionVariantOneTwo
  | QuestionVariantTrueOrFalse
  | QuestionVariantMultipleCorrect


