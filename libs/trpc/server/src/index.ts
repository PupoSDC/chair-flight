import { createServerSideHelpers } from "@trpc/react-query/server";
import { createContext } from "./config/context";
import { router } from "./config/trpc";
import { questionsRouter } from "./routers/question";

export const appRouter = router({
  questions: questionsRouter,
});

export const getTrpcHelper = async () => {
  return createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
  });
};

export type AppRouter = typeof appRouter;
