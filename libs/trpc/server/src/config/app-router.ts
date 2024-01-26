import { analyticsRouter } from "../routers/analytics";
import { blogRouter } from "../routers/blog";
import { questionBankRouter } from "../routers/question-bank";
import { questionBankAnnexSearchRouter } from "../routers/question-bank-annex-search";
import { questionBankDocsRouter } from "../routers/question-bank-docs";
import { questionBankLoSearchRouter } from "../routers/question-bank-lo-search";
import { questionBankQuestionSearchRouter } from "../routers/question-bank-question-search";
import { questionBankQuestionsRouter } from "../routers/question-bank-questions";
import { statusRouter } from "../routers/status";
import { testsRouter } from "../routers/tests";
import { router } from "./trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  blog: blogRouter,
  analytics: analyticsRouter,
  status: statusRouter,
  questionBank: questionBankRouter,
  questionBankDocs: questionBankDocsRouter,
  questionBankQuestions: questionBankQuestionsRouter,
  questionBankQuestionSearch: questionBankQuestionSearchRouter,
  questionBankLoSearch: questionBankLoSearchRouter,
  questionBankAnnexSearch: questionBankAnnexSearchRouter,
  tests: testsRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
