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

type SimplifiedTrackEvent = {
  eventName: string;
  anonymousId: string;
  timestamp: number;
  path: string;
  resolvedPath: string;
  properties: Record<string, unknown>;
};

export type TrackEvent = TrackEventBase<keyof TrackEventMap>;

export const TrackEventSchema: z.ZodSchema<SimplifiedTrackEvent> = z.object({
  eventName: z.string(),
  anonymousId: z.string(),
  path: z.string(),
  resolvedPath: z.string(),
  timestamp: z.number(),
  properties: z.object({}).passthrough(),
});
