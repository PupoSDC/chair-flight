import { z } from "zod";
import { questionBanks } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const overviewsContainersRouter = router({
  getOverviewModules: publicProcedure.input(z.object({})).query(async () => ({
    numberOfFlashcards: (await questionBanks["prep"].getAll("flashcards"))
      .length,
    numberOfAtplQuestions: (await questionBanks["atpl"].getAll("questions"))
      .length,
    numberOfTypeQuestions: (await questionBanks["type"].getAll("questions"))
      .length,
  })),
  getOverviewWelcome: publicProcedure.input(z.object({})).query(async () => ({
    numberOfFlashcards: (await questionBanks["prep"].getAll("flashcards"))
      .length,
    numberOfAtplQuestions: (await questionBanks["atpl"].getAll("questions"))
      .length,
    numberOfTypeQuestions: (await questionBanks["type"].getAll("questions"))
      .length,
  })),
});
