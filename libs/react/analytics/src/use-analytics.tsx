import { createContext, useContext, useState } from "react";
import { useAnalyticsPlugin } from "./use-analytics-plugin";
import type {
  TrackEventName,
  TrackEventPayload,
} from "@chair-flight/core/analytics";
import type { AnalyticsInstance } from "analytics";
import type { FunctionComponent, PropsWithChildren } from "react";

const analyticsContext = createContext<Promise<AnalyticsInstance>>(
  null as unknown as Promise<AnalyticsInstance>,
);

export const AnalyticsProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const plugin = useAnalyticsPlugin();
  const [analytics] = useState(async () =>
    (await import("analytics")).default({
      app: "chair-flight",
      version: "1",
      plugins: [plugin],
    }),
  );
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
      if (!analytics) return;
      analytics.then((a) => a.page());
    },

    track: <T extends TrackEventName>(
      name: T,
      payload: TrackEventPayload<T> = {},
    ) => {
      if (!analytics) return;
      analytics.then((a) => a.track(name, payload));
    },
  };
};
