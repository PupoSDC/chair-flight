import { z } from "zod";

type TrackEventMap = {
  "themeButton.switch": Record<string, never>;
};

type TrackEventBase<T extends keyof TrackEventMap> = {
  eventName: T;
  anonymousId: string;
  timestamp: number;
  path: string;
  resolvedPath: string;
  properties: TrackEventMap[T];
};

export type TrackEvent = TrackEventBase<keyof TrackEventMap>;
export type TrackEventName = TrackEvent["eventName"];
export type TrackEventPayload<T extends TrackEventName> = TrackEventMap[T];

export const TrackEventSchema: z.ZodSchema<TrackEvent> = z.object({
  eventName: z.string(),
  anonymousId: z.string(),
  path: z.string(),
  resolvedPath: z.string(),
  timestamp: z.number(),
  properties: z.object({}).passthrough(),
}) as unknown as z.ZodSchema<TrackEvent>;
