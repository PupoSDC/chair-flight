import { analyticsRouter } from "../routers/analytics-router";
import { blogRouter } from "../routers/blog-router";
import { questionBankDocsRouter } from "../routers/question-bank-docs-router";
import { questionBankQuestionsRouter } from "../routers/question-bank-questions-router";
import { questionBankSearchRouter } from "../routers/question-bank-search";
import { supportRouter } from "../routers/support-router";
import { router } from "./trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  analytics: analyticsRouter,
  blog: blogRouter,
  support: supportRouter,
  questionBank: router({
    search: questionBankSearchRouter,
    questions: questionBankQuestionsRouter,
    docs: questionBankDocsRouter,
  }),
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
