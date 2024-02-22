import { router } from "./config/trpc";
import { analyticsRouter } from "./routers/analytics-router";
import { searchRouter } from "./routers/search-router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  common: router({
    // blog: blogRouter,
    // docs: docsRouter,
    // github: githubRouter,
    // tests: testsRouter,
    // questions: questionsRouter,
    search: searchRouter,
    analytics: analyticsRouter,
    // status: statusRouter,
    // userProgress: userProgressRouter,
  }),
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
