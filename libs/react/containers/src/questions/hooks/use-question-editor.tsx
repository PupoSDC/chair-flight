import { z } from "zod";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { deepClone } from "@chair-flight/base/utils";
import { questionTemplateSchema } from "@chair-flight/core/question-bank";
import type { PersistenceKey } from "../../hooks/use-persistence";
import type {
  QuestionBankName,
  QuestionId,
  QuestionVariant,
} from "@chair-flight/core/question-bank";
import type { trpc } from "@chair-flight/trpc/client";

const diffSchema = z.object({
  beforeState: z.record(questionTemplateSchema),
  afterState: z.record(questionTemplateSchema.or(z.null())),
});

const editorSchema = z.object({
  atpl: diffSchema,
  type: diffSchema,
  prep: diffSchema,
});

type TrpcUtils = ReturnType<typeof trpc.useUtils>;

export type QuestionEditorState = z.infer<typeof editorSchema>;

export type QuestionEditorActions = {
  addQuestion: (
    trpc: TrpcUtils,
    bank: QuestionBankName,
    id: QuestionId,
  ) => Promise<void>;

  removeQuestion: (
    trpc: TrpcUtils,
    bank: QuestionBankName,
    id: QuestionId,
  ) => Promise<void>;

  isQuestionInEditor: (bank: QuestionBankName, id: QuestionId) => boolean;

  markQuestionAsDeleted: (bank: QuestionBankName, id: QuestionId) => void;

  undoMarkQuestionAsDeleted: (bank: QuestionBankName, id: QuestionId) => void;

  setQuestionExplanation: (
    bank: QuestionBankName,
    id: QuestionId,
    explanation: string,
  ) => void;

  setQuestionLearningObjectives: (
    bank: QuestionBankName,
    id: QuestionId,
    learningObjectives: string[],
  ) => void;

  setQuestionVariant: (
    bank: QuestionBankName,
    id: QuestionId,
    variant: QuestionVariant,
  ) => void;

  setQuestionAnnexes: (
    bank: QuestionBankName,
    id: QuestionId,
    annexes: string[],
  ) => void;
};

export type QuestionEditor = QuestionEditorState & QuestionEditorActions;

const persistenceKey: PersistenceKey = "cf-question-editor";

export const useQuestionEditor = create<QuestionEditor>()(
  persist(
    immer(
      devtools((set, get) => ({
        atpl: { beforeState: {}, afterState: {} },
        type: { beforeState: {}, afterState: {} },
        prep: { beforeState: {}, afterState: {} },
        addQuestion: async (
          trpc: TrpcUtils,
          questionBank: QuestionBankName,
          questionId: QuestionId,
        ) => {
          const router = trpc.common.questions;
          const { question, relatedQuestions } =
            await router.getQuestionTemplate.fetch({
              questionBank,
              questionId,
            });

          set((state: QuestionEditorState) => {
            [question, ...relatedQuestions].forEach((template) => {
              const id = template.id;
              state[questionBank].beforeState[id] = template;
              state[questionBank].afterState[id] = template;
            });
          });
        },
        removeQuestion: async (
          trpc: TrpcUtils,
          questionBank: QuestionBankName,
          questionId: QuestionId,
        ) => {
          const router = trpc.common.questions;
          const { question, relatedQuestions } =
            await router.getQuestionTemplate.fetch({
              questionBank,
              questionId,
            });
          set((state: QuestionEditorState) => {
            [question, ...relatedQuestions].forEach((template) => {
              const id = template.id;
              delete state[questionBank].beforeState[id];
              delete state[questionBank].afterState[id];
            });
          });
        },
        isQuestionInEditor: (bank: QuestionBankName, id: QuestionId) => {
          return !!get()[bank].beforeState[id];
        },
        markQuestionAsDeleted: (bank: QuestionBankName, id: QuestionId) =>
          set((state: QuestionEditorState) => {
            const question = state[bank].afterState[id];
            if (!question) return;
            question.relatedQuestions.forEach((relatedQuestionId) => {
              const relatedQuestion = state[bank].afterState[relatedQuestionId];
              if (!relatedQuestion) return;
              relatedQuestion.relatedQuestions =
                relatedQuestion.relatedQuestions.filter((i) => i !== id);
            });

            state[bank].afterState[id] = null;
          }),
        undoMarkQuestionAsDeleted: (bank: QuestionBankName, id: QuestionId) =>
          set((state: QuestionEditorState) => {
            state[bank].afterState[id] = deepClone(state[bank].beforeState[id]);
            [id, ...state[bank].beforeState[id].relatedQuestions].forEach(
              (id) => {
                const before = state[bank].beforeState[id];
                const after = state[bank].afterState[id];
                if (!after) return;
                after.relatedQuestions = before.relatedQuestions.filter(
                  (i) => !!state[bank].afterState[i],
                );
              },
            );
          }),
        setQuestionExplanation: (
          bank: QuestionBankName,
          id: QuestionId,
          explanation: string,
        ) =>
          set((state: QuestionEditorState) => {
            const question = state[bank].afterState[id];
            if (!question) return;
            question.explanation = explanation;
          }),
        setQuestionLearningObjectives: (
          bank: QuestionBankName,
          id: QuestionId,
          learningObjectives: string[],
        ) =>
          set((state: QuestionEditorState) => {
            const question = state[bank].afterState[id];
            if (!question) return;
            question.learningObjectives = learningObjectives;
          }),
        setQuestionVariant: (
          bank: QuestionBankName,
          id: QuestionId,
          variant: QuestionVariant,
        ) =>
          set((state: QuestionEditorState) => {
            const question = state[bank].afterState[id];
            if (!question) return;
            question.variant = variant;
          }),
        setQuestionAnnexes: (
          bank: QuestionBankName,
          id: QuestionId,
          annexes: string[],
        ) =>
          set((state: QuestionEditorState) => {
            const question = state[bank].afterState[id];
            if (!question) return;
            question.annexes = annexes;
          }),
      })),
    ),
    { name: persistenceKey },
  ),
);
