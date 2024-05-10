import { defineConfig } from "drizzle-kit";
import { getEnvVariableOrThrow } from "@cf/base/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: getEnvVariableOrThrow("PROVIDER_POSTGRES_ANALYTICS"),
  },
});
