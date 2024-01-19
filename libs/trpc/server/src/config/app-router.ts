import { analyticsRouter } from "../routers/analytics";
import { questionBankRouter } from "../routers/question-bank";
import { questionBankLoSearchRouter } from "../routers/question-bank-lo-search";
import { questionBankQuestionSearchRouter } from "../routers/question-bank-question-search";
import { statusRouter } from "../routers/status";
import { testsRouter } from "../routers/tests";
import { router } from "./trpc";

export const appRouter = router({
  analytics: analyticsRouter,
  status: statusRouter,
  questionBank: questionBankRouter,
  questionBankQuestionSearch: questionBankQuestionSearchRouter,
  questionBankLoSearch: questionBankLoSearchRouter,
  tests: testsRouter,
});

export type AppRouter = typeof appRouter;
