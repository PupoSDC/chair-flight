import { z } from "zod";
import {
  createPageEvent,
  createTrackEvent,
  generateDailyCounts,
  getPageVisits,
} from "@chair-flight/providers/analytics";
import { publicProcedure, router } from "../../config/trpc";
import type { PageEvent, SimplifiedTrackEvent } from "@chair-flight/base/types";

const PageEventSchema: z.ZodSchema<PageEvent> = z.object({
  anonymousId: z.string(),
  title: z.string(),
  path: z.string(),
  resolvedPath: z.string(),
  height: z.number(),
  width: z.number(),
  referrer: z.string().optional(),
  timestamp: z.number(),
});

const TrackEventSchema: z.ZodSchema<SimplifiedTrackEvent> = z.object({
  eventName: z.string(),
  anonymousId: z.string(),
  path: z.string(),
  resolvedPath: z.string(),
  timestamp: z.number(),
  properties: z.object({}).passthrough(),
});

export const analyticsRouter = router({
  createPageEvent: publicProcedure
    .input(PageEventSchema)
    .mutation(async ({ input }) => createPageEvent(input)),
  trackEvent: publicProcedure
    .input(TrackEventSchema)
    .mutation(async ({ input }) => createTrackEvent(input)),
  visitsPerDay: publicProcedure.query(async () => {
    await generateDailyCounts();
    return getPageVisits();
  }),
});
