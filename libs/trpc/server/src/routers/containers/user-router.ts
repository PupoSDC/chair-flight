import { publicProcedure, router } from "../../config/trpc";

export const userContainersRouter = router({
  getBugReport: publicProcedure.query(async () => ({})),
  getUserSettings: publicProcedure.query(async () => ({})),
});
