import { useEffect } from "react";
import type { QuestionBankName } from "../../core/question-bank/question-banks";

export const useQuestionBankTheme = (questionBank?: QuestionBankName) => {
  useEffect(() => {
    const root = document.documentElement;
    if (questionBank) root.dataset.bank = questionBank;
    return () => {
      delete root.dataset.bank;
    };
  }, [questionBank]);
};
