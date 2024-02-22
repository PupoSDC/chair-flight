"use client";

import { create } from "zustand";
import { ThemeOverrideColorScheme } from "@cf/react/theme";
import type { QuestionBankName } from "@cf/core/question-bank";

export const useThemeOverride = create<{
  questionBank: QuestionBankName | undefined;
  setQuestionBank: (questionBank: QuestionBankName) => void;
}>((set) => ({
  questionBank: undefined,
  setQuestionBank: (questionBank: QuestionBankName) => set({ questionBank }),
}));

export const ThemeOverride = () => {
  const questionBank = useThemeOverride((s) => s.questionBank);
  return <ThemeOverrideColorScheme questionBank={questionBank} />;
};
