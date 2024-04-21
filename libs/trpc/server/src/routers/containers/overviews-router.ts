import { z } from "zod";
import { questionBanks } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";
import { Content } from "@cf/providers/content";

export const overviewsContainersRouter = router({
  getOverviewModules: publicProcedure.input(z.object({})).query(async () => ({
    numberOfFlashcards: (await questionBanks["prep"].getAll("flashcards"))
      .length,
    numberOfAtplQuestions: (await questionBanks["atpl"].getAll("questions"))
      .length,
    numberOfTypeQuestions: (await questionBanks["type"].getAll("questions"))
      .length,
  })),
  getOverviewWelcome: publicProcedure.input(z.object({})).query(async () => {
    const content = new Content();
    return {
      numberOfFlashcards:
        (await content.getBankMetadata("prep")).numberOfFlashcardCollections,
      numberOfAtplQuestions:
        (await content.getBankMetadata("atpl")).numberOfQuestions,
      numberOfTypeQuestions:
        (await content.getBankMetadata("type")).numberOfQuestions,
    };
  }),
});
