import { createContext, useContext, useState } from "react";
import { default as Analytics } from "analytics";
import { useAnalyticsPlugin } from "./use-analytics-plugin";
import type {
  TrackEventName,
  TrackEventPayload,
} from "@chair-flight/base/types";
import type { AnalyticsInstance } from "analytics";
import type { FunctionComponent, PropsWithChildren } from "react";

const analyticsContext = createContext<AnalyticsInstance>(
  null as unknown as AnalyticsInstance,
);

export const AnalyticsProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const plugin = useAnalyticsPlugin();
  const [analytics] = useState(() =>
    Analytics({
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
      analytics.page();
    },

    track: <T extends TrackEventName>(
      name: T,
      payload: TrackEventPayload<T> = {},
    ) => {
      analytics.track(name, payload);
    },
  };
};
