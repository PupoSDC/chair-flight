import { analyticsRouter } from "../routers/analytics";
import { questionBankRouter } from "../routers/question-bank";
import { questionBankQuestionSearchRouter } from "../routers/question-bank-question-search";
import { statusRouter } from "../routers/status";
import { router } from "./trpc";

export const appRouter = router({
  analytics: analyticsRouter,
  status: statusRouter,
  questionBank: questionBankRouter,
  questionBankQuestionSearch: questionBankQuestionSearchRouter,
});

export type AppRouter = typeof appRouter;
