import { useCallback, useEffect } from "react";
import { z } from "zod";
import { questionBankNameSchema, questionTemplateSchema } from "@chair-flight/core/question-bank";
import { PersistenceKey, createUsePersistenceHook } from "../../hooks/use-persistence";
import type { QuestionBankName, QuestionId, QuestionTemplate } from "@chair-flight/core/question-bank";
import { trpc } from "@chair-flight/trpc/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'

const diffSchema = z.object({
  beforeState: z.record(questionTemplateSchema),
  afterState: z.record(questionTemplateSchema.or(z.null())),
});

const editorSchema = z.object({
  atpl: diffSchema,
  type: diffSchema,
  prep: diffSchema,
});

export type QuestionEditorState = z.infer<typeof editorSchema>;

export type QuestionEditorActions = {
  addQuestions: (bank: QuestionBankName,templates: QuestionTemplate[]) => void;
  deleteQuestion: (bank: QuestionBankName,id: QuestionId) => void;
  unDeleteQuestion: (bank: QuestionBankName,id: QuestionId) => void;

  revertQuestion: (
    id: string,
    bank: QuestionBankName,
  ) => void;
  addAnnex: (
    id: string,
    bank: QuestionBankName,
    annexId: string
  ) => void;
  removeAnnex: (
    id: string,
    bank: QuestionBankName,
    annexId: string
  ) => void;
  addRelatedQuestion: (
    id: string,
    bank: QuestionBankName,
    questionId: string
  ) => void;
  removeRelatedQuestion: (
    id: string,
    bank: QuestionBankName,
    questionId: string
  ) => void;
  setExplanation: (
    id: string,
    bank: QuestionBankName,
    explanation: string
  ) => void;
  addLearningObjective: (
    id: string,
    bank: QuestionBankName,
    learningObjectives: string,
  ) => void;
  removeLearningObjective: (
    id: string,
    bank: QuestionBankName,
    learningObjectives: string,
  ) => void;
};

export type QuestionEditor = QuestionEditorState & QuestionEditorActions;


const persistenceKey: PersistenceKey = "cf-question-editor";

const useZustand = create<
  QuestionEditor
>()(
  persist(
    immer(
      devtools(
        (set, get) => ({
          atpl: { beforeState: {}, afterState: {} },
          type: { beforeState: {}, afterState: {} },
          prep: { beforeState: {}, afterState: {} },
          addQuestions: (
            bank: QuestionBankName,
            templates: QuestionTemplate[]
          ) => set((state: QuestionEditorState) => {
            templates.forEach((template) => {
              const id = template.id;
              state[bank].beforeState[id] = template;
              state[bank].afterState[id] = template;
            });
          }),
          deleteQuestion: (
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
          unDeleteQuestion: (
            bank: QuestionBankName,
            id: QuestionId,
          ) => set((state: QuestionEditorState) => {
            state[bank].afterState[id] = state[bank].beforeState[id];
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
          }),
        })
      )
    ),
    { name: persistenceKey }
  )
);

export const useQuestionEditor = ({
  questionBank,
}: {
  questionBank: QuestionBankName;
}) => {
  const utils = trpc.useUtils();
  const zustand = useZustand();
  const getQuestionTemplate = utils.common.questions.getQuestionTemplate.fetch;

  const addQuestion = async (questionId: string) => {
    const { question, relatedQuestions } = await getQuestionTemplate({
      questionBank,
      questionId,
    });
    zustand.addQuestions(questionBank, [question, ...relatedQuestions]);
  };

  const deleteQuestion = async (questionId: string) => {
    zustand.deleteQuestion(questionBank, questionId);
  };

  const unDeleteQuestion = async (questionId: string) => {
    zustand.unDeleteQuestion(questionBank, questionId);
  }

  const revertQuestion = async (questionId: string) => {
    zustand.revertQuestion(questionId, questionBank);
  };


  const isDeleted = (questionId: string) => {
    return zustand[questionBank].afterState[questionId] === null;
  }

  const isEdited = (questionId: string) => {
    return !!zustand[questionBank].afterState[questionId];
  }

  const isTouched = (questionId: string) => {
    return isEdited(questionId) || isDeleted(questionId);
  }

  const getQuestionState = (questionId: string) => {
    return zustand[questionBank].afterState[questionId];
  }

  const addAnnex = (questionId: string, annexId: string) => {
    zustand.addAnnex(questionId, questionBank, annexId);
  }

  const removeAnnex = (questionId: string, annexId: string) => {
    zustand.removeAnnex(questionId, questionBank, annexId);
  }

  const hasAnnex = (questionId: string, annexId: string) => {
    return zustand[questionBank].afterState[questionId].annexes.includes(annexId);
  }

  const addRelatedQuestion = (questionId: string, relatedQuestionId: string) => {
    zustand.addRelatedQuestion(questionId, questionBank, relatedQuestionId);
  }

  const removeRelatedQuestion = (questionId: string, relatedQuestionId: string) => {
    zustand.removeRelatedQuestion(questionId, questionBank, relatedQuestionId);
  }

  const hasRelatedQuestion = (questionId: string, relatedQuestionId: string) => {
    return zustand[questionBank].afterState[questionId].relatedQuestions.includes(relatedQuestionId);
  }

  const setExplanation = (questionId: string, explanation: string) => {
    zustand.setExplanation(questionId, questionBank, explanation);
  }

  const addLearningObjective = (questionId: string, loId: string) => {
    zustand.addLearningObjective(questionId, questionBank, loId);
  }

  const removeLearningObjective = (questionId: string, loId: string) => {
    zustand.removeLearningObjective(questionId, questionBank, loId);
  }

  const hasLearningObjective = (questionId: string, loId: string) => {
    return zustand[questionBank].afterState[questionId].learningObjectives.includes(loId);
  }

  return {
    currentState: zustand[questionBank].afterState,
    isTouched,
    isEdited,
    isDeleted,
    addQuestion,
    deleteQuestion,
    revertQuestion,
    getQuestionState,
    addAnnex,
    removeAnnex,
    hasAnnex,
    addRelatedQuestion,
    removeRelatedQuestion,
    hasRelatedQuestion,
    setExplanation,
    addLearningObjective,
    removeLearningObjective,
    hasLearningObjective,
    unDeleteQuestion,
  };
};
