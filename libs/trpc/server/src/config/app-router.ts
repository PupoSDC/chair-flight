import { analyticsRouter } from "../routers/analytics";
import { flashCardsRouter } from "../routers/flash-cards";
import { learningObjectivesRouter } from "../routers/learning-objectives";
import { questionBank737Router } from "../routers/question-bank-737";
import { questionsRouter } from "../routers/questions";
import { searchRouter } from "../routers/search";
import { statusRouter } from "../routers/status";
import { testsRouter } from "../routers/tests";
import { router } from "./trpc";

export const appRouter = router({
  analytics: analyticsRouter,
  questions: questionsRouter,
  search: searchRouter,
  flashCards: flashCardsRouter,
  tests: testsRouter,
  learningObjectives: learningObjectivesRouter,
  status: statusRouter,
  questionBank737: questionBank737Router,
});

export type AppRouter = typeof appRouter;
