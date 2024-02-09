import { createContext, useState } from "react";
import { useAnalyticsPlugin } from "../hooks/use-analytics-plugin";
import type { AnalyticsInstance } from "analytics";
import type { FunctionComponent, PropsWithChildren } from "react";

export const analyticsContext = createContext<Promise<AnalyticsInstance>>(
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
