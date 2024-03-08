import { router } from "./config/trpc";
import { githubRouter } from "./routers/github-router";
import { searchRouter } from "./routers/search-router";
import { statusRouter } from "./routers/status-router";
import { testsRouter } from "./routers/tests-router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  search: searchRouter,
  status: statusRouter,
  github: githubRouter,
  tests: testsRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
