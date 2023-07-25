import { z } from "zod";
import { newTestConfigurationSchema, createTest } from "@chair-flight/core/app";
import { publicProcedure, router } from "../config/trpc";

export const testsRouter = router({
  getAllSubjects: publicProcedure.query(async ({ ctx }) => {
    const { questionBank } = ctx;
    const subjects = await questionBank.getAllSubjects();
    return subjects;
  }),
  createTest: publicProcedure
    .input(
      z.object({
        config: newTestConfigurationSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { config } = input;
      const { questionBank } = ctx;
      const test = createTest({ config, questionBank });
      return test;
    }),
});
