import { type InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import type { trackEvent } from "../../drizzle/schema";

export type TrackEvent = Pick<
  InferSelectModel<typeof trackEvent>,
  "anonymousId" | "eventName" | "properties" | "path" | "resolvedPath"
>;

export const trackEventSchema: z.ZodSchema<TrackEvent> = z.strictObject({
  eventName: z.string(),
  anonymousId: z.string(),
  path: z.string(),
  resolvedPath: z.string(),
  properties: z.object({}).passthrough(),
});
