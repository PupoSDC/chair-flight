import { useEffect, useRef } from "react";
import { useThemeOverride } from "./theme-override";
import type { QuestionBankName } from "@cf/core/question-bank";

export const usePreviewContainer = (questionBank: QuestionBankName) => {
  const currentQb = useThemeOverride((s) => s.questionBank);
  const hasScrolled = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isCurrentQb = currentQb === questionBank;
    if (!isCurrentQb) hasScrolled.current = false;
    if (!isCurrentQb || hasScrolled.current) return;
    hasScrolled.current = true;
    setTimeout(() => {
      const top = containerRef.current?.offsetTop ?? 0;
      window.scrollTo({ top: top - 50, behavior: "smooth" });
    }, 100);
  });

  return { questionBank: currentQb, containerRef };
};
