export type PageEvent = {
  anonymousId: string;
  title: string;
  url: string;
  height: number;
  width: number;
  referrer: string;
  timestamp: number;
};

export type TrackEventMap = {
  "exploreQuestions.click": Record<string, unknown>;
};

export type TrackEventName = keyof TrackEventMap;
export type TrackEventPayload<T extends TrackEventName> = TrackEventMap[T];

export type TrackEvent<T extends TrackEventName> = {
  eventName: T;
  anonymousId: string;
  timestamp: number;
  url: string;
  properties: TrackEventPayload<T>;
};

export type SimplifiedTrackEvent = {
  eventName: string;
  anonymousId: string;
  timestamp: number;
  url: string;
  properties: Record<string, unknown>;
};
