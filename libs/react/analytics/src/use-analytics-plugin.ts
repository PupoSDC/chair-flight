import { useRouter } from "next/dist/client/router";
import { trpc } from "@chair-flight/trpc/client";
import type { AnalyticsPlugin } from "analytics";

type OriginalPageViewProps = {
  payload: {
    type: "page";
    anonymousId: string;
    properties: {
      title: string;
      url: string;
      height: number;
      width: number;
      referrer: string;
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

export const useAnalyticsPlugin = (): AnalyticsPlugin => {
  const router = useRouter();
  const createPageEvent = trpc.analytics.createPageEvent.useMutation();
  const trackEvent = trpc.analytics.trackEvent.useMutation();

  return {
    name: "chair-flight-analytics-plugin",
    config: {},
    loaded: () => true,
    initialize: () => {},
    identify: () => {},
    page: (props: OriginalPageViewProps) => {
      createPageEvent.mutate({
        path: router.pathname,
        resolvedPath: router.asPath,
        anonymousId: props.payload.anonymousId,
        title: props.payload.properties.title,
        height: props.payload.properties.height,
        width: props.payload.properties.width,
        referrer: props.payload.properties.referrer,
        timestamp: Date.now(),
      });
    },
    track: (props: OriginalTrackEventProps) => {
      trackEvent.mutate({
        eventName: props.payload.event,
        anonymousId: props.payload.anonymousId,
        path: router.pathname,
        resolvedPath: router.asPath,
        properties: props.payload.properties,
        timestamp: Date.now(),
      });
    },
  };
};
