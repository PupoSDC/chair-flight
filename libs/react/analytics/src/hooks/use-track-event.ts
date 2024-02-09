import { useCallback, useContext, useRef } from "react";
import { analyticsContext } from "../components/analytics-provider";

type TrackEventMap = {
  "themeButton.switch": Record<string, never>;
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

  return { trackEvent };
};
