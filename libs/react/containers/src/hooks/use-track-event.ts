import { useCallback } from "react";
import { trpc } from "@cf/react/trpc";
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

const useTrackEventMutation = trpc.analytics.trackEvent.useMutation;

export const useTrackEvent = () => {
  const { mutate: mutateTrackEvent } = useTrackEventMutation();

  const trackEvent = useCallback(
    <T extends TrackEventName>(eventName: T, properties: TrackEventMap[T]) => {
      mutateTrackEvent({
        eventName,
        properties,
        path: "",
        resolvedPath: "",
        anonymousId: "",
      });
    },
    [mutateTrackEvent],
  );

  return trackEvent;
};
