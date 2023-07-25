import { z } from "zod";
import { publicProcedure, router } from "../config/trpc";


export const analyticsRouter = router({
    trackEvent: publicProcedure
        .input(z.object({
            eventName: z.string(),
            payload: z.object({}).passthrough(),
        }))
        .query(async ({ input }) => {
            
})