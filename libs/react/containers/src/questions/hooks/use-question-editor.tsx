import { useCallback, useEffect } from "react";
import { z } from "zod";
import { questionBankNameSchema, questionTemplateSchema } from "@chair-flight/core/question-bank";
import { PersistenceKey, createUsePersistenceHook } from "../../hooks/use-persistence";
import type { QuestionBankName, QuestionId, QuestionTemplate } from "@chair-flight/core/question-bank";
import { trpc } from "@chair-flight/trpc/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { deepClone } from "@chair-flight/base/utils";

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
    id: QuestionId
  ) => Promise<void>;

  removeQuestion: (
    trpc: TrpcUtils,
    bank: QuestionBankName, 
    id: QuestionId
  ) => Promise<void>;

  isQuestionInEditor: (
    bank: QuestionBankName, 
    id: QuestionId
  ) => boolean;
  
  markQuestionAsDeleted: (
    bank: QuestionBankName, 
    id: QuestionId
  ) => void;

  undoMarkQuestionAsDeleted: (
    bank: QuestionBankName, 
    id: QuestionId
  ) => void;

  setQuestionExplanation: (
    bank: QuestionBankName, 
    id: QuestionId, 
    explanation: string
  ) => void;

  setQuestionLearningObjectives: (
    bank: QuestionBankName, 
    id: QuestionId, 
    learningObjectives: string[]
  ) => void;
};

export type QuestionEditor = QuestionEditorState & QuestionEditorActions;


const persistenceKey: PersistenceKey = "cf-question-editor";

export const useQuestionEditor = create<
  QuestionEditor
>()(
  persist(
    immer(
      devtools(
        (set, get) => ({
          atpl: { beforeState: {}, afterState: {} },
          type: { beforeState: {}, afterState: {} },
          prep: { beforeState: {}, afterState: {} },
          addQuestion: async (
            trpc: TrpcUtils,
            questionBank: QuestionBankName,
            questionId: QuestionId
          ) => {
            const router = trpc.common.questions;
            const {
              question,
              relatedQuestions,
            } = await router.getQuestionTemplate.fetch({
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
            questionId: QuestionId
          ) => {
            const router = trpc.common.questions;
            const {
              question,
              relatedQuestions,
            } = await router.getQuestionTemplate.fetch({
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
          isQuestionInEditor: (
            bank: QuestionBankName,
            id: QuestionId
          ) => {
            return !!get()[bank].beforeState[id];
          },
          markQuestionAsDeleted: (
            bank: QuestionBankName,
            id: QuestionId,
          ) => set((state: QuestionEditorState) => {
            const question = state[bank].afterState[id];
            if (!question) return;
            question.relatedQuestions.forEach((relatedQuestionId) => {
              const relatedQuestion = state[bank].afterState[relatedQuestionId];
              if (!relatedQuestion) return;
              relatedQuestion.relatedQuestions = relatedQuestion
                .relatedQuestions
                .filter((i) => i !== id);
            });

            state[bank].afterState[id] = null;
          }),
          undoMarkQuestionAsDeleted: (
            bank: QuestionBankName,
            id: QuestionId,
          ) => set((state: QuestionEditorState) => {
            state[bank].afterState[id] = deepClone(state[bank].beforeState[id]);
            [
              id, 
              ...state[bank].beforeState[id].relatedQuestions
            ].forEach((id) => {
              const before = state[bank].beforeState[id];
              const after = state[bank].afterState[id];
              if (!after) return;
              after.relatedQuestions = before.relatedQuestions
                .filter((i) => !!state[bank].afterState[i]);
            });
          }),
          setQuestionExplanation: (
            bank: QuestionBankName,
            id: QuestionId,
            explanation: string
          ) => set((state: QuestionEditorState) => {
            const question = state[bank].afterState[id];
            if (!question) return;
            question.explanation = explanation;
          }),
          setQuestionLearningObjectives: (
            bank: QuestionBankName,
            id: QuestionId,
            learningObjectives: string[]
          ) => set((state: QuestionEditorState) => {
            const question = state[bank].afterState[id];
            if (!question) return;
            question.learningObjectives = learningObjectives;
          }),
          /**
          removeQuestionFromEditor: (

          ) => set((state: QuestionEditorState) => {
            state[bank].beforeState[id] = null;
            state[bank].afterState[id] = null;
          }


          deleteAllUnchanged: (
            bank: QuestionBankName
          ) => set((state: QuestionEditorState) => {
            const ids = Object.keys(state[bank].beforeState);
            ids.forEach((id) => {
              const before = JSON.stringify(state[bank].beforeState[id]);
              const after = JSON.stringify(state[bank].afterState[id]); 
              if (before === after) {
                delete state[bank].beforeState[id];
                delete state[bank].afterState[id];
              }
            });
          }),
          revertQuestion: (
            id: string,
            bank: QuestionBankName
          ) => set((state) => {
            delete state[bank].beforeState[id];
            delete state[bank].afterState[id];
          }),
          addAnnex: (
            id: string,
            bank: QuestionBankName,
            annexId: string
          ) => set((state: QuestionEditorState) => {
            if (state[bank].afterState[id].annexes.includes(annexId)) return;
            state[bank].afterState[id].annexes.push(annexId);
          }),
          removeAnnex: (
            id: string,
            bank: QuestionBankName,
            annexId: string
          ) => set((state: QuestionEditorState) => {
            state[bank].afterState[id].annexes = state[bank].afterState[id].annexes.filter((i) => i !== annexId);
          }),
          addRelatedQuestion: (
            id: string,
            bank: QuestionBankName,
            questionId: string
          ) => set((state: QuestionEditorState) => {
            if (state[bank].afterState[id].relatedQuestions.includes(questionId)) return;
            state[bank].afterState[id].relatedQuestions.push(questionId);
          }),
          removeRelatedQuestion: (
            id: string,
            bank: QuestionBankName,
            questionId: string
          ) => set((state: QuestionEditorState) => {
            state[bank].afterState[id].relatedQuestions = state[bank].afterState[id].relatedQuestions.filter((i) => i !== questionId);
          }),
          setExplanation: (
            id: string,
            bank: QuestionBankName,
            explanation: string
          ) => set((state: QuestionEditorState) => {
            state[bank].afterState[id].explanation = explanation;
          }),
          addLearningObjective: (
            id: string,
            bank: QuestionBankName,
            learningObjective: string
          ) => set((state: QuestionEditorState) => {
            if (state[bank].afterState[id].learningObjectives.includes(learningObjective)) return;
            state[bank].afterState[id].learningObjectives.push(learningObjective);
          }),
          removeLearningObjective: (
            id: string,
            bank: QuestionBankName,
            learningObjective: string
          ) => set((state: QuestionEditorState) => {
            state[bank].afterState[id].learningObjectives = state[bank].afterState[id].learningObjectives.filter((i) => i !== learningObjective);
          }),*/
        }) 
      )
    ),
    { name: persistenceKey }
  )
);