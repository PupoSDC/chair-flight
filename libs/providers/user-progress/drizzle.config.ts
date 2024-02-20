import { getEnvVariableOrThrow } from "@cf/base/env";
import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: getEnvVariableOrThrow("PROVIDER_POSTGRES_USER_PROGRESS"),
  },
} satisfies Config;
