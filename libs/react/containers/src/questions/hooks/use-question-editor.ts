import { z } from "zod";
import type { StateCreator} from "zustand";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { deepClone } from "@chair-flight/base/utils";
import { shared } from 'use-broadcast-ts';
import {
  getQuestionPreview,
  questionTemplateSchema,
} from "@chair-flight/core/question-bank";
import type { PersistenceKey } from "../../hooks/use-persistence";
import type {
  QuestionBankName,
  QuestionId,
  QuestionVariant,
} from "@chair-flight/core/question-bank";
import type { trpc } from "@chair-flight/trpc/client";

const persistenceKey: PersistenceKey = "cf-question-editor";

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

type QuestionEditor = z.infer<typeof editorSchema> & {
  addQuestion: (args: {
    trpc: TrpcUtils;
    questionBank: QuestionBankName;
    questionId: QuestionId;
  }) => Promise<void>;

  removeQuestion: (args: {
    trpc: TrpcUtils;
    questionBank: QuestionBankName;
    questionId: QuestionId;
  }) => Promise<void>;

  resetQuestion: (args: {
    questionBank: QuestionBankName;
    questionId: QuestionId;
  }) => void;

  isQuestionInEditor: (args: {
    questionBank: QuestionBankName;
    questionId: QuestionId;
  }) => boolean;

  markQuestionAsDeleted: (args: {
    questionBank: QuestionBankName;
    questionId: QuestionId;
  }) => void;

  setQuestionExplanation: (args: {
    questionBank: QuestionBankName;
    questionId: QuestionId;
    explanation: string;
  }) => void;

  setQuestionLearningObjectives: (args: {
    questionBank: QuestionBankName;
    questionId: QuestionId;
    learningObjectives: string[];
  }) => void;

  setQuestionVariant: (args: {
    questionBank: QuestionBankName;
    questionId: QuestionId;
    variant: QuestionVariant;
  }) => void;

  setQuestionAnnexes: (args: {
    questionBank: QuestionBankName;
    questionId: QuestionId;
    annexes: string[];
  }) => void;

  unlinkQuestion: (args: {
    questionBank: QuestionBankName;
    questionId: QuestionId;
  }) => void;

  connectTwoQuestions: (args: {
    trpc: TrpcUtils;
    questionBank: QuestionBankName;
    questionA: QuestionId;
    questionB: QuestionId;
  }) => Promise<void>;

  getDiffStatus: (args: {
    questionBank: QuestionBankName;
    questionId: QuestionId;
  }) => {
    hasPreviewChanged: boolean;
    hasLosChanged: boolean;
    hasAnnexesChanged: boolean;
    hasRelatedQsChanged: boolean;
    hasRelatedQs: boolean;
    isEdited: boolean;
    isDeleted: boolean;
    current: {
      preview: string;
      los: string;
      annexes: string;
      relatedQs: string;
    };
    initial: {
      preview: string;
      los: string;
      annexes: string;
      relatedQs: string;
    };
  };

  getQuestionsWithADiff: (args: {
    questionBank: QuestionBankName;
  }) => QuestionId[];
};

const questionEditor : StateCreator<QuestionEditor> = (set, get) => ({
  atpl: { beforeState: {}, afterState: {} },
  type: { beforeState: {}, afterState: {} },
  prep: { beforeState: {}, afterState: {} },
  addQuestion: async ({ trpc, questionBank, questionId }) => {
    const router = trpc.common.questions;
    const { question, relatedQuestions } =
      await router.getQuestionTemplate.fetch({
        questionBank,
        questionId,
      });

    set((state: QuestionEditor) => {
      [question, ...relatedQuestions].forEach((template) => {
        const id = template.id;
        state[questionBank].beforeState[id] = template;
        state[questionBank].afterState[id] = template;
      });
    });
  },
  removeQuestion: async ({ trpc, questionBank, questionId }) => {
    const router = trpc.common.questions;
    const { question, relatedQuestions } =
      await router.getQuestionTemplate.fetch({
        questionBank,
        questionId,
      });
    set((state: QuestionEditor) => {
      [question, ...relatedQuestions].forEach((template) => {
        const id = template.id;
        delete state[questionBank].beforeState[id];
        delete state[questionBank].afterState[id];
      });
    });
  },
  resetQuestion: ({ questionBank, questionId }) => {
    set((state: QuestionEditor) => {
      state[questionBank].afterState[questionId] = deepClone(
        state[questionBank].beforeState[questionId],
      );
      [
        questionId,
        ...state[questionBank].beforeState[questionId].relatedQuestions,
      ].forEach((id) => {
        const before = state[questionBank].beforeState[id];
        const after = state[questionBank].afterState[id];
        if (!after) return;
        after.relatedQuestions = before.relatedQuestions.filter(
          (i) => !!state[questionBank].afterState[i],
        );
      });
    });
  },
  isQuestionInEditor: ({ questionBank, questionId }) => {
    return !!get()[questionBank].beforeState[questionId];
  },
  markQuestionAsDeleted: ({ questionBank, questionId }) => {
    set((state: QuestionEditor) => {
      const question = state[questionBank].afterState[questionId];
      if (!question) return;
      question.relatedQuestions.forEach((relatedQuestionId) => {
        const relatedQuestion =
          state[questionBank].afterState[relatedQuestionId];
        if (!relatedQuestion) return;
        relatedQuestion.relatedQuestions =
          relatedQuestion.relatedQuestions.filter(
            (i) => i !== questionId,
          );
      });

      state[questionBank].afterState[questionId] = null;
    });
  },
  setQuestionExplanation: ({ questionBank, questionId, explanation }) => {
    set((state: QuestionEditor) => {
      const question = state[questionBank].afterState[questionId];
      if (!question) return;
      question.explanation = explanation;
    });
  },
  setQuestionLearningObjectives: ({
    questionBank,
    questionId,
    learningObjectives,
  }) => {
    set((state: QuestionEditor) => {
      const question = state[questionBank].afterState[questionId];
      if (!question) return;
      question.learningObjectives = learningObjectives;
    });
  },
  setQuestionVariant: ({ questionBank, questionId, variant }) => {
    set((state: QuestionEditor) => {
      const question = state[questionBank].afterState[questionId];
      if (!question) return;
      question.variant = variant;
    });
  },
  setQuestionAnnexes: ({ questionBank, questionId, annexes }) => {
    set((state: QuestionEditor) => {
      const question = state[questionBank].afterState[questionId];
      if (!question) return;
      question.annexes = annexes;
    });
  },
  unlinkQuestion: ({ questionBank, questionId }) => {
    set((state: QuestionEditor) => {
      const question = state[questionBank].afterState[questionId];
      if (!question) return;
      question.relatedQuestions.forEach((q) => {
        const thisQuestion = state[questionBank].afterState[q];
        if (!thisQuestion) return;
        thisQuestion.relatedQuestions =
          thisQuestion.relatedQuestions.filter((i) => i !== questionId);
      });
      question.relatedQuestions = [];
    });
  },
  connectTwoQuestions: async ({
    trpc,
    questionBank,
    questionA: questionAid,
    questionB: questionBid,
  }) => {
    const questionA = get()[questionBank].afterState[questionAid];
    const questionB = get()[questionBank].afterState[questionBid];

    if (!questionA) {
      const questionId = questionAid;
      await get().addQuestion({ trpc, questionBank, questionId });
    }
    if (!questionB) {
      const questionId = questionBid;
      await get().addQuestion({ trpc, questionBank, questionId });
    }

    const questionIds = [
      ...new Set([
        questionAid,
        questionBid,
        ...(get()[questionBank].afterState[questionAid]
          ?.relatedQuestions ?? []),
        ...(get()[questionBank].afterState[questionBid]
          ?.relatedQuestions ?? []),
      ]),
    ];

    set((state: QuestionEditor) => {
      questionIds.forEach((id) => {
        const question = state[questionBank].afterState[id];
        if (!question) return;
        question.relatedQuestions = questionIds.filter((i) => i !== id);
        console.log(question.relatedQuestions);
      });
    });
  },
  getDiffStatus: ({ questionBank, questionId }) => {
    const initialState = get()[questionBank].beforeState[questionId];
    const currentState = get()[questionBank].afterState[questionId];

    const initial = {
      preview: getQuestionPreview(initialState.variant),
      los: initialState.learningObjectives.join(", ") || "None",
      annexes: initialState.annexes.join(", ") || "None",
      relatedQs: initialState.relatedQuestions.join(", ") || "None",
    };

    const current = currentState
      ? {
          preview: getQuestionPreview(currentState.variant),
          los: currentState.learningObjectives.join(", ") || "None",
          annexes: currentState.annexes.join(", ") || "None",
          relatedQs: currentState.relatedQuestions.join(", ") || "None",
        }
      : initial;

    const hasRelatedQs = !!currentState?.relatedQuestions.length;
    const hasPreviewChanged = initial.preview !== current.preview;
    const hasLosChanged = initial.los !== current.los;
    const hasAnnexesChanged = initial.annexes !== current.annexes;
    const hasRelatedQsChanged = initial.relatedQs !== current.relatedQs;
    const isDeleted = currentState === null;
    const isEdited =
      hasPreviewChanged ||
      hasLosChanged ||
      hasAnnexesChanged ||
      hasRelatedQsChanged;

    return {
      hasPreviewChanged,
      hasLosChanged,
      hasAnnexesChanged,
      hasRelatedQsChanged,
      hasRelatedQs,
      isEdited,
      isDeleted,
      current,
      initial,
    };
  },
  getQuestionsWithADiff: ({ questionBank }) => {
    return Object.keys(get()[questionBank].afterState).filter((id) => {
      const diff = get().getDiffStatus({ questionBank, questionId: id });
      return diff.isEdited || diff.isDeleted;
    });
  },
});

const persistOpts = { name: persistenceKey };
const sharedOpts = { name: persistenceKey };
const ssrSafeEditor = persist(immer(devtools(questionEditor)), persistOpts);

export const useQuestionEditor = typeof window === "undefined"
  ? create<QuestionEditor>()(ssrSafeEditor)
  : create<QuestionEditor>()(shared(ssrSafeEditor, sharedOpts));

