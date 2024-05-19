import { analyticsRouter } from "../routers/analytics-router";
import { blogRouter } from "../routers/blog-router";
import { supportRouter } from "../routers/support-router";
import { router } from "./trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  analytics: analyticsRouter,
  blog: blogRouter,
  support: supportRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
