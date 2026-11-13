import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../database";
import { readEnv } from "../base/read-env";

class SupabaseDb {
  private readonly poolSize = 10;
  private readonly idleTimeoutSeconds = 5;
  public readonly db;

  public constructor(connectionString: string) {
    const pg = postgres(connectionString, {
      prepare: false,
      max: this.poolSize,
      idle_timeout: this.idleTimeoutSeconds,
    });
    this.db = drizzle(pg, { schema });
  }
}

let instance: SupabaseDb | null = null;

export const getSupabaseDb = () => {
  instance ??= new SupabaseDb(readEnv("DATABASE_URL"));
  return instance.db;
};
