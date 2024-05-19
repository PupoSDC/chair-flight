import {
  Analytics,
  pageEventSchema,
  trackEventSchema,
} from "@cf/providers/analytics";
import { publicProcedure, router } from "../config/trpc";

export const analyticsRouter = router({
  createPageEvent: publicProcedure
    .input(pageEventSchema)
    .mutation(async ({ input }) => {
      const analytics = new Analytics();
      return analytics.createPageEvent(input);
    }),
  trackEvent: publicProcedure
    .input(trackEventSchema)
    .mutation(async ({ input }) => {
      const analytics = new Analytics();
      return analytics.createTrackEvent(input);
    }),
  getDailyUsers: publicProcedure.query(async () => {
    const analytics = new Analytics();
    return analytics.getDailyUsers();
  }),
  getPagesUsed: publicProcedure.query(async () => {
    const analytics = new Analytics();
    return analytics.getPagesUsed();
  }),
});
