import { createAction } from "@reduxjs/toolkit";
import type {
  QuestionTemplate,
  QuestionVariant,
} from "@chair-flight/base/types";

export const resetQuestionEditor = createAction<{
  question: QuestionTemplate;
}>("question-editor/question-reset");

export const mergeQuestionVariants = createAction<{
  questionId: string;
  fromVariantId: string;
  toVariantId: string;
}>("question-editor/question-variants-merged");

export const undoQuestionEditorLastChange = createAction<{
  questionId: string;
}>("question-editor/undid-last-change");

export const deleteQuestionVariant = createAction<{
  questionId: string;
  variantId: string;
}>("question-editor/question-variant-deleted");

export const updateQuestionLearningObjectives = createAction<{
  questionId: string;
  learningObjectives: string[];
}>("question-editor/question-learning-objectives-updated");

export const updateQuestionExplanation = createAction<{
  questionId: string;
  explanation: string;
}>("question-editor/question-explanation-updated");

export const createNewQuestionVariant = createAction<{
  questionId: string;
  variant: QuestionVariant;
}>("question-editor/question-variant-created");

export const updateQuestionVariant = createAction<{
  questionId: string;
  variant: QuestionVariant;
}>("question-editor/question-variant-updated");
