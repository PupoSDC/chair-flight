import { z } from "zod";
import { newTestConfigurationSchema, createTest } from "@chair-flight/core/app";
import { publicProcedure, router } from "../config/trpc";

export const testsRouter = router({
  getAllSubjects: publicProcedure.query(async () => {
    //const allSubjects = await
    const subjects = allSubjects.filter(
      (lo) => !["034", "082"].includes(lo.id),
    );
    return { subjects };
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
      const test = await createTest({ config, questionBank });
      return { test };
    }),
});
