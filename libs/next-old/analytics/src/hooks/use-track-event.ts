import { useCallback, useContext, useRef } from "react";
import { analyticsContext } from "../components/analytics-provider";
import type { QuestionBankName } from "@cf/core/question-bank";

type TrackEventMap = {
  "themeButton.switch": Record<string, never>;
  "questions.search": { questionBank: QuestionBankName; query: string };
  "learningObjectives.search": {
    questionBank: QuestionBankName;
    query: string;
  };
  "annexes.search": { questionBank: QuestionBankName; query: string };
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
  const analytics = useContext(analyticsContext);
  const ref = useRef(analytics);
  ref.current = analytics;

  const trackEvent = useCallback(
    <T extends TrackEventName>(name: T, payload: TrackEventMap[T]) => {
      ref.current?.then((a) => a.track(name, payload));
    },
    [],
  );

  return trackEvent;
};
