import { analyticsRouter } from "../routers/analytics-router";
import { blogRouter } from "../routers/blog-router";
import { questionBankRouter } from "../routers/question-bank-router";
import { supportRouter } from "../routers/support-router";
import { router } from "./trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  analytics: analyticsRouter,
  blog: blogRouter,
  support: supportRouter,
  questionBank: questionBankRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
