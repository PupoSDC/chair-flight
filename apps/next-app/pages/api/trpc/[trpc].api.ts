import * as trpcNext from "@trpc/server/adapters/next";
import { getQuestionBank } from "@chair-flight/question-bank/providers";
import { appRouter } from "@chair-flight/trpc/server";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => {
    const questionBank = getQuestionBank();
    return {
      questionBank,
    };
  },
});

export const config = {
  runtime: "edge",
};
