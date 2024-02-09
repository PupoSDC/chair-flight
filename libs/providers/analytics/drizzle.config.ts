import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: getEnvVariableOrThrow("PROVIDER_POSTGRES_ANALYTICS"),
  },
} satisfies Config;
