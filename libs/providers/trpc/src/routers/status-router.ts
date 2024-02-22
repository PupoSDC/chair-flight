import { getEnvVariableOrThrow } from "@cf/base/env";
import { publicProcedure, router } from "../../config/trpc";

export const statusRouter = router({
  getEnv: publicProcedure.query(() => ({
    envFileName: getEnvVariableOrThrow("ENV_FILE_NAME"),
  })),
});
