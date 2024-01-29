import { analyticsRouter } from "../routers/common/analytics-router";
import { blogRouter } from "../routers/common/blog-router";
import { githubRouter } from "../routers/common/github-router";
import { searchRouter } from "../routers/common/search-router";
import { statusRouter } from "../routers/common/status-router";
import { testsRouter } from "../routers/common/tests-router";
import { annexesContainersRouter } from "../routers/containers/annexes-router";
import { blogContainersRouter } from "../routers/containers/blog-router";
import { docsContainersRouter } from "../routers/containers/docs-router";
import { flashcardsContainersRouter } from "../routers/containers/flashcards-router";
import { layoutsContainersRouter } from "../routers/containers/layouts-router";
import { learningObjectivesContainersRouter } from "../routers/containers/learning-objectives-router";
import { overviewsContainersRouter } from "../routers/containers/overviews-router";
import { questionsContainersRouter } from "../routers/containers/questions-router";
import { testsContainersRouter } from "../routers/containers/tests-router";
import { userContainersRouter } from "../routers/containers/user-router";
import { blogPagesRouter } from "../routers/pages/blog-pages-router";
import { modulesPagesRouter } from "../routers/pages/modules-pages-router";
import { router } from "./trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  common: router({
    blog: blogRouter,
    github: githubRouter,
    tests: testsRouter,
    search: searchRouter,
    analytics: analyticsRouter,
    status: statusRouter,
  }),

  pageGeneration: router({
    modules: modulesPagesRouter,
    blog: blogPagesRouter,
  }),

  containers: router({
    annexes: annexesContainersRouter,
    blog: blogContainersRouter,
    docs: docsContainersRouter,
    flashcards: flashcardsContainersRouter,
    layouts: layoutsContainersRouter,
    overviews: overviewsContainersRouter,
    questions: questionsContainersRouter,
    learningObjectives: learningObjectivesContainersRouter,
    tests: testsContainersRouter,
    user: userContainersRouter,
  }),
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
