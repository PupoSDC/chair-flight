import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/index.ts",
  schemaFilter: ["chair_flight"],
  out: "./src/database/migrations",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  migrations: {
    schema: "chair_flight",
    table: "__drizzle_migrations",
  },
});
