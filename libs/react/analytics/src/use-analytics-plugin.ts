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
        anonymousId: props.payload.anonymousId,
        title: props.payload.properties.title,
        url: props.payload.properties.url,
        height: props.payload.properties.height,
        width: props.payload.properties.width,
        referrer: props.payload.properties.referrer,
        timestamp: Date.now(),
      });
    },
    track: (props: OriginalTrackEventProps) => {
      trackEvent.mutate({
        eventName: props.payload.event,
        url: window.location.href,
        anonymousId: props.payload.anonymousId,
        properties: props.payload.properties,
        timestamp: Date.now(),
      });
    },
  };
};
