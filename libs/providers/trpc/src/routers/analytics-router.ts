import {
  Analytics,
  pageEventSchema,
  trackEventSchema,
} from "@cf/providers/analytics";
import { publicProcedure, router } from "../config/trpc";

export const analyticsRouter = router({
  createPageEvent: publicProcedure
    .input(pageEventSchema)
    .mutation(async ({ input }) => Analytics.get().createPageEvent(input)),
  trackEvent: publicProcedure
    .input(trackEventSchema)
    .mutation(async ({ input }) => Analytics.get().createTrackEvent(input)),
  getDailyUsers: publicProcedure.query(async () =>
    Analytics.get().getDailyUsers(),
  ),
  getPagesUsed: publicProcedure.query(async () =>
    Analytics.get().getPagesUsed(),
  ),
});
