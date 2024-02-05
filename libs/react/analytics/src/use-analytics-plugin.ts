import { useRouter } from "next/dist/client/router";
import { NOOP } from "@chair-flight/base/utils";
import { trpc } from "@chair-flight/trpc/client";
import type { TrackEventName } from "@chair-flight/core/analytics";
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
    event: TrackEventName;
    anonymousId: string;
    properties: Record<string, unknown>;
  };
};

export const useAnalyticsPlugin = (): AnalyticsPlugin => {
  const router = useRouter();
  const createPageEvent = trpc.common.analytics.createPageEvent.useMutation();
  const trackEvent = trpc.common.analytics.trackEvent.useMutation();

  return {
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
        properties: props.payload.properties as Record<string, never>,
        timestamp: Date.now(),
      });
    },
  };
};
