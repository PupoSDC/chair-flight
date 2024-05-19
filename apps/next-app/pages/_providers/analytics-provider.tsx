import { createContext, useState } from "react";
import { useRouter } from "next/router";
import { NOOP } from "@cf/base/utils";
import { trpc } from "@cf/trpc/client";
import type { AnalyticsInstance } from "analytics";
import type { FunctionComponent, PropsWithChildren } from "react";

type OriginalPageViewProps = {
  payload: {
    type: "page";
    anonymousId: string;
    properties: {
      title: string;
      url: string;
      height: number;
      width: number;
    };
  };
};

type OriginalTrackEventProps = {
  payload: {
    type: "track";
    event: string;
    anonymousId: string;
    properties: Record<string, unknown>;
  };
};

export const analyticsContext = createContext<Promise<AnalyticsInstance>>(
  null as unknown as Promise<AnalyticsInstance>,
);

export const AnalyticsProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const createPageEvent = trpc.analytics.createPageEvent.useMutation();
  const trackEvent = trpc.analytics.trackEvent.useMutation();

  const [analytics] = useState(async () =>
    (await import("analytics")).default({
      app: "chair-flight",
      version: "1",
      plugins: [
        {
          name: "chair-flight-analytics-plugin",
          config: {},
          loaded: () => true,
          initialize: NOOP,
          identify: NOOP,
          page: (props: OriginalPageViewProps) => {
            createPageEvent.mutate({
              path: router.pathname,
              resolvedPath: router.asPath,
              anonymousId: props.payload.anonymousId,
              title: props.payload.properties.title,
              height: props.payload.properties.height,
              width: props.payload.properties.width,
            });
          },
          track: (props: OriginalTrackEventProps) => {
            trackEvent.mutate({
              eventName: props.payload.event,
              anonymousId: props.payload.anonymousId,
              path: router.pathname,
              resolvedPath: router.asPath,
              properties: props.payload.properties as Record<string, never>,
            });
          },
        },
      ],
    }),
  );
  return (
    <analyticsContext.Provider value={analytics}>
      {children}
    </analyticsContext.Provider>
  );
};
