import { flashCardsRouter } from "../routers/flash-cards";
import { learningObjectivesRouter } from "../routers/learning-objectives";
import { questionsRouter } from "../routers/questions";
import { searchRouter } from "../routers/search";
import { testsRouter } from "../routers/tests";
import { router } from "./trpc";

export const appRouter = router({
  questions: questionsRouter,
  search: searchRouter,
  flashCards: flashCardsRouter,
  tests: testsRouter,
  learningObjectives: learningObjectivesRouter,
});

export type AppRouter = typeof appRouter;
