import {
  pageEventSchema,
  trackEventSchema,
} from "@chair-flight/providers/analytics";
import { analytics } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const analyticsRouter = router({
  createPageEvent: publicProcedure
    .input(pageEventSchema)
    .mutation(async ({ input }) => analytics.createPageEvent(input)),
  trackEvent: publicProcedure
    .input(trackEventSchema)
    .mutation(async ({ input }) => analytics.createTrackEvent(input)),
  getDailyUsers: publicProcedure.query(async () => analytics.getDailyUsers()),
});
