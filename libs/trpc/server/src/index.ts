import { createServerSideHelpers } from "@trpc/react-query/server";
import { createContext } from "./config/context";
import { router } from "./config/trpc";
import { questionReviewRouter } from "./routers/question-review";

export const appRouter = router({
  questionReview: questionReviewRouter,
});

export const getTrpcHelper = async () => {
  return createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
  });
};

export type AppRouter = typeof appRouter;
