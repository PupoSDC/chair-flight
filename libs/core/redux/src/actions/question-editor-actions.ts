import { createAction } from "@reduxjs/toolkit";
import type { QuestionTemplate } from "@chair-flight/base/types";

export const resetQuestionEditor = createAction<{
    question: QuestionTemplate;
}>("question-editor/question-reset");

export const updateQuestionTemplate = createAction<{
    question: QuestionTemplate;
}>("question-editor/question-updated");

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
}>("question-editor/question-learning-objectives-updated")