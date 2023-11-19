import { createContext, useContext, useEffect, useState } from "react";
import { useAnalyticsPlugin } from "./use-analytics-plugin";
import type {
  TrackEventName,
  TrackEventPayload,
} from "@chair-flight/base/types";
import type { AnalyticsInstance } from "analytics";
import type { FunctionComponent, PropsWithChildren } from "react";

const analyticsContext = createContext<AnalyticsInstance | null>(null);

export const AnalyticsProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const plugin = useAnalyticsPlugin();
  const [analytics, setAnalytics] = useState<AnalyticsInstance | null>(null);

  useEffect(() => {
    (async () => {
      const Analytics = (await import("analytics")).default;
      setAnalytics(
        Analytics({
          app: "chair-flight",
          version: "1",
          plugins: [plugin],
        }),
      );
    })();
  }, [plugin]);

  return (
    <analyticsContext.Provider value={analytics}>
      {children}
    </analyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const analytics = useContext(analyticsContext);

  return {
    page: () => {
      analytics?.page();
    },

    track: <T extends TrackEventName>(
      name: T,
      payload: TrackEventPayload<T> = {},
    ) => {
      analytics?.track(name, payload);
    },
  };
};
