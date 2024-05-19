import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { getEnvVariableOrThrow } from "@cf/base/env";
import { analyticsSchema } from "../drizzle";
import { getDailyUsers } from "./functions/get-daily-users";
import { getPagesUsed } from "./functions/get-pages-used";
import type { AnalyticsDb } from "../drizzle";
import type { PageEvent } from "./entities/page-event";
import type { TrackEvent } from "./entities/track-event";

export class Analytics {
  private static staticDb: AnalyticsDb;

  private db = Analytics.staticDb;
  private schema = analyticsSchema;

  constructor() {
    Analytics.staticDb ??= (() => {
      const schema = analyticsSchema;
      const pgProvider = getEnvVariableOrThrow("PROVIDER_POSTGRES_ANALYTICS");
      const client = new Client({ connectionString: pgProvider });
      const db = drizzle(client, { schema });
      client.connect();
      return db;
    })();
  }

  async createPageEvent(event: PageEvent) {
    await this.db.insert(this.schema.pageEvent).values(event);
  }

  async createTrackEvent(event: TrackEvent) {
    await this.db.insert(this.schema.trackEvent).values(event);
  }

  async getDailyUsers() {
    return getDailyUsers(this.db);
  }

  async getPagesUsed() {
    return getPagesUsed(this.db);
  }
}
