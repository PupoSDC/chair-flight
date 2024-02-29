import { router } from "./config/trpc";
import { githubRouter } from "./routers/github-router";
import { searchRouter } from "./routers/search-router";
import { statusRouter } from "./routers/status-router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  search: searchRouter,
  status: statusRouter,
  github: githubRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
