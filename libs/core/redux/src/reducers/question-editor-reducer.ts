import { createReducer } from "@reduxjs/toolkit";
import { InvalidStoreState, InvalidStoreStateActionType } from "@chair-flight/base/errors";
import { questionSchema } from "@chair-flight/question-bank/schemas";
import {
  updateQuestionTemplate,
  mergeQuestionVariants,
  resetQuestionEditor,
  undoQuestionEditorLastChange,
  deleteQuestionVariant,
  updateQuestionLearningObjectives,
} from "../actions/question-editor-actions";
import type { QuestionTemplate } from "@chair-flight/base/types";

export type QuestionEditorEntry = {
  // the last element in the array is the current version of the question
  history: QuestionTemplate[];
};

export type QuestionEditor = {
  questions: Record<string, QuestionEditorEntry | undefined>;
};

const getQuestionEditorEntryOrDefault = (
  store: QuestionEditor,
  questionId: string
): QuestionEditorEntry => {
  store.questions[questionId] ??= {
    history: [],
  };
  return store.questions[questionId] as QuestionEditorEntry;
};

const getDeepCopyOfLastEntryOrThrow = ({
    store,
    questionId,
    action
} : {
    store: QuestionEditor,
    questionId: string,
    action: InvalidStoreStateActionType
}): QuestionTemplate => {
    const currentQuestion = store.questions[questionId]?.history?.at(-1);
    if (!currentQuestion) {
        throw new InvalidStoreState(
            `Question ${questionId} not found in question editor`,
            action
        );
    }
    const newQuestion = questionSchema.parse(currentQuestion);
    store.questions[questionId]?.history.push(newQuestion);
    return newQuestion;
}

export const questionEditorReducer = createReducer<QuestionEditor>(
  {
    questions: {},
  },
  (builder) => {
    builder
      .addCase(resetQuestionEditor, (store, action) => {
        const { question } = action.payload;
        const entry = getQuestionEditorEntryOrDefault(store, question.id);
        entry.history = [question];
      })
      .addCase(updateQuestionTemplate, (store, action) => {
        const { question } = action.payload;
        const entry = getQuestionEditorEntryOrDefault(store, question.id);
        entry.history.push(question);
      })
      .addCase(undoQuestionEditorLastChange, (store, action) => {
        const { questionId } = action.payload;
        const entry = getQuestionEditorEntryOrDefault(store, questionId);
        entry.history.pop();
      })
      .addCase(mergeQuestionVariants, (store, action) => {
        const { questionId, fromVariantId, toVariantId } = action.payload;
        const question = getDeepCopyOfLastEntryOrThrow({
            store, 
            questionId, 
            action
        });

        const fromVariant = question.variants[fromVariantId];
        const toVariant = question.variants[toVariantId];
        toVariant.externalIds = [
          ...new Set([
            ...toVariant.externalIds,
            ...fromVariant.externalIds
          ])
        ];
        delete question.variants[fromVariantId];
      })
      .addCase(deleteQuestionVariant, (store, action) => {
        const { questionId, variantId } = action.payload;
        const question = getDeepCopyOfLastEntryOrThrow({
            store, 
            questionId, 
            action
        });
        delete question.variants[variantId];
      })
      .addCase(updateQuestionLearningObjectives, (store, action) => {
        const { questionId, learningObjectives } = action.payload;
        const question = getDeepCopyOfLastEntryOrThrow({
            store, 
            questionId, 
            action
        });
        question.learningObjectives = learningObjectives;
      })
  }
);
