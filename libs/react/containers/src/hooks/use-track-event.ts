import { useCallback, useContext, useRef } from "react";
import { trpcNext14 } from "@cf/trpc/client";
import type { QuestionBankName } from "@cf/core/question-bank";

type TrackEventMap = {
  "themeButton.switch": Record<string, never>;
  "questions.search": {
    questionBank: QuestionBankName;
    query: string;
  };
  "learningObjectives.search": {
    questionBank: QuestionBankName;
    query: string;
  };
  "annexes.search": {
    questionBank: QuestionBankName;
    query: string;
  };
  "docs.search": {
    questionBank: QuestionBankName;
    query: string;
  };
  "test.create": {
    questionBank: QuestionBankName;
    subject: string;
    mode: string;
  };
  "test.finish": {
    questionBank: QuestionBankName;
    subject: string;
    mode: string;
    score: number;
  };
};

type TrackEventName = keyof TrackEventMap;

export const useTrackEvent = () => {
  const trpcUtils = trpcNext14.useUtils();
  const ref = useRef(trpcUtils.common.analytics);
  ref.current = trpcUtils.common.analytics;

  const trackEvent = useCallback(
    <T extends TrackEventName>(name: T, payload: TrackEventMap[T]) => {
      ref.current?.trackEvent;
    },
    [],
  );

  return trackEvent;
};
