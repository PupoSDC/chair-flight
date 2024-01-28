import { z } from "zod";
import { publicProcedure, router } from "../../config/trpc";

export const testsContainersRouter = router({
  getTestExam: publicProcedure.input(z.object({})).query(async () => ({})),
  getTestMaker: publicProcedure.input(z.object({})).query(async () => ({})),
  getTestReview: publicProcedure.input(z.object({})).query(async () => ({})),
  getTestSearch: publicProcedure.input(z.object({})).query(async () => ({})),
  getTestStudy: publicProcedure.input(z.object({})).query(async () => ({})),
});
