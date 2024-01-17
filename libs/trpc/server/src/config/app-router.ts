import { analyticsRouter } from "../routers/analytics";
import { questionBankRouter } from "../routers/question-bank";
import { statusRouter } from "../routers/status";
import { router } from "./trpc";

export const appRouter = router({
  analytics: analyticsRouter,
  status: statusRouter,
  questionBank: questionBankRouter,
});

export type AppRouter = typeof appRouter;
