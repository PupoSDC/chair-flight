import { createReducer } from "@reduxjs/toolkit";
import { InvalidStoreState } from "@chair-flight/base/errors";
import {
  mergeQuestionVariants,
  resetQuestionEditor,
  undoQuestionEditorLastChange,
  deleteQuestionVariant,
  updateQuestionLearningObjectives,
  updateQuestionExplanation,
  createNewQuestionVariant,
  updateQuestionVariant,
  deleteEditorState,
} from "../actions/question-editor-actions";
import type { InvalidStoreStateActionType } from "@chair-flight/base/errors";
import type { QuestionTemplate } from "@chair-flight/base/types";

export type QuestionEditorEntry = {
  currentVersion: QuestionTemplate;
  history: QuestionTemplate[];
};

export type QuestionEditor = {
  questions: Record<string, QuestionEditorEntry | undefined>;
};

const getEntryOrThrow = ({
  store,
  questionId,
  action,
}: {
  store: QuestionEditor;
  questionId: string;
  action: InvalidStoreStateActionType;
}): QuestionEditorEntry => {
  const entry = store.questions[questionId];
  if (entry) return entry;
  throw new InvalidStoreState(
    `Question ${questionId} not found in question editor`,
    action
  );
};

const deepCopy = <T>(a: T): T => JSON.parse(JSON.stringify(a));

export const questionEditorReducer = createReducer<QuestionEditor>(
  {
    questions: {},
  },
  (builder) => {
    builder
      .addCase(resetQuestionEditor, (store, action) => {
        const { question } = action.payload;
        store.questions[question.id] = {
          currentVersion: question,
          history: [],
        };
      })
      .addCase(undoQuestionEditorLastChange, (store, action) => {
        const { questionId } = action.payload;
        const entry = getEntryOrThrow({ store, action, questionId });
        const pop = store.questions[questionId]?.history.pop();
        if (!pop) return;
        entry.currentVersion = pop;
      })
      .addCase(mergeQuestionVariants, (store, action) => {
        const { questionId, fromVariantId, toVariantId } = action.payload;
        const entry = getEntryOrThrow({ store, action, questionId });
        entry.history.push(deepCopy(entry.currentVersion));
        entry.currentVersion.variants[toVariantId].externalIds = [
          ...new Set([
            ...entry.currentVersion.variants[toVariantId].externalIds,
            ...entry.currentVersion.variants[fromVariantId].externalIds,
          ]),
        ];
        delete entry.currentVersion.variants[fromVariantId];
      })
      .addCase(deleteQuestionVariant, (store, action) => {
        const { questionId, variantId } = action.payload;
        const entry = getEntryOrThrow({ store, action, questionId });
        entry.history.push(deepCopy(entry.currentVersion));
        delete entry.currentVersion.variants[variantId];
      })
      .addCase(updateQuestionLearningObjectives, (store, action) => {
        const { questionId, learningObjectives } = action.payload;
        const entry = getEntryOrThrow({ store, action, questionId });
        entry.history.push(deepCopy(entry.currentVersion));
        entry.currentVersion.learningObjectives = learningObjectives;
      })
      .addCase(updateQuestionExplanation, (store, action) => {
        const { questionId, explanation } = action.payload;
        const entry = getEntryOrThrow({ store, action, questionId });
        entry.history.push(deepCopy(entry.currentVersion));
        entry.currentVersion.explanation = explanation;
      })
      .addCase(createNewQuestionVariant, (store, action) => {
        const { questionId, variant } = action.payload;
        const entry = getEntryOrThrow({ store, action, questionId });
        entry.history.push(deepCopy(entry.currentVersion));
        entry.currentVersion.variants = {
          [variant.id]: variant,
          ...entry.currentVersion.variants,
        };
      })
      .addCase(updateQuestionVariant, (store, action) => {
        const { questionId, variant } = action.payload;
        const entry = getEntryOrThrow({ store, action, questionId });
        entry.history.push(deepCopy(entry.currentVersion));
        entry.currentVersion.variants[variant.id] = variant;
      })
      .addCase(deleteEditorState, (store, action) => {
        const { questionId } = action.payload;
        delete store.questions[questionId];
      });
  }
);
