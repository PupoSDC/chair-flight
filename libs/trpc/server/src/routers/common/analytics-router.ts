import {
  PageEventSchema,
  TrackEventSchema,
} from "@chair-flight/core/analytics";
import { analytics } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const analyticsRouter = router({
  createPageEvent: publicProcedure
    .input(PageEventSchema)
    .mutation(async ({ input }) => analytics.createPageEvent(input)),
  trackEvent: publicProcedure
    .input(TrackEventSchema)
    .mutation(async ({ input }) => analytics.createTrackEvent(input)),
});
