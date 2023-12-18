import { analyticsRouter } from "../routers/analytics";
import { interviewPrepRouter } from "../routers/interview-prep";
import { questionBankRouter } from "../routers/question-bank";
import { statusRouter } from "../routers/status";
import { router } from "./trpc";

export const appRouter = router({
  analytics: analyticsRouter,
  status: statusRouter,
  interviewPrep: interviewPrepRouter,
  questionBank: questionBankRouter,
});

export type AppRouter = typeof appRouter;
