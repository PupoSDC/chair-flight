import { analyticsRouter } from "../routers/analytics";
import { interviewPrepRouter } from "../routers/interview-prep";
import { questionBank737Router } from "../routers/question-bank-737";
import { questionBankAtplRouter } from "../routers/question-bank-atpl";
import { statusRouter } from "../routers/status";
import { router } from "./trpc";

export const appRouter = router({
  analytics: analyticsRouter,
  status: statusRouter,
  interviewPrep: interviewPrepRouter,
  questionBank737: questionBank737Router,
  questionBankAtpl: questionBankAtplRouter,
});

export type AppRouter = typeof appRouter;
