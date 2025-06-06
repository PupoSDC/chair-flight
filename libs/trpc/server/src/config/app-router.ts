import { analyticsRouter } from "../routers/common/analytics-router";
import { blogRouter } from "../routers/common/blog-router";
import { docsRouter } from "../routers/common/docs-router";
import { githubRouter } from "../routers/common/github-router";
import { questionsRouter } from "../routers/common/questions-router";
import { searchRouter } from "../routers/common/search-router";
import { statusRouter } from "../routers/common/status-router";
import { testsRouter } from "../routers/common/tests-router";
import { userProgressRouter } from "../routers/common/user-progress-router";
import { annexesContainersRouter } from "../routers/containers/annexes-router";
import { docsContainersRouter } from "../routers/containers/docs-router";
import { flashcardsContainersRouter } from "../routers/containers/flashcards-router";
import { layoutsContainersRouter } from "../routers/containers/layouts-router";
import { learningObjectivesContainersRouter } from "../routers/containers/learning-objectives-router";
import { overviewsContainersRouter } from "../routers/containers/overviews-router";
import { questionsContainersRouter } from "../routers/containers/questions-router";
import { testsContainersRouter } from "../routers/containers/tests-router";
import { userContainersRouter } from "../routers/containers/user-router";
import { modulesPagesRouter } from "../routers/pages/modules-pages-router";
import { router } from "./trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  common: router({
    blog: blogRouter,
    docs: docsRouter,
    github: githubRouter,
    tests: testsRouter,
    questions: questionsRouter,
    search: searchRouter,
    analytics: analyticsRouter,
    status: statusRouter,
    userProgress: userProgressRouter,
  }),

  pageGeneration: router({
    modules: modulesPagesRouter,
  }),

  containers: router({
    annexes: annexesContainersRouter,
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
