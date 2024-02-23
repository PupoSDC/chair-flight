import { router } from "./config/trpc";
import { analyticsRouter } from "./routers/analytics-router";
import { blogRouter } from "./routers/blog-router";
import { githubRouter } from "./routers/github-router";
import { questionsRouter } from "./routers/questions-router";
import { searchRouter } from "./routers/search-router";
import { statusRouter } from "./routers/status-router";
import { testsRouter } from "./routers/tests-router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  blog: blogRouter,
  github: githubRouter,
  tests: testsRouter,
  questions: questionsRouter,
  search: searchRouter,
  analytics: analyticsRouter,
  status: statusRouter,
  // userProgress: userProgressRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
