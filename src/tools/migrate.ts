import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const runMigrations = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl)
    throw new Error("Missing environment variable DATABASE_URL.");
  const connection = postgres(databaseUrl, { prepare: false, max: 1 });
  try {
    await migrate(drizzle(connection), {
      migrationsFolder: "./src/database/migrations",
      migrationsSchema: "chair_flight",
      migrationsTable: "__drizzle_migrations",
    });
  } finally {
    await connection.end();
  }
};

await runMigrations();
