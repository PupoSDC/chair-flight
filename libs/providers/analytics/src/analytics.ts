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
  private db: AnalyticsDb;
  private static instance: Analytics;

  private constructor() {
    const schema = analyticsSchema;
    const pgProvider = getEnvVariableOrThrow("PROVIDER_POSTGRES_ANALYTICS");
    const client = new Client({ connectionString: pgProvider });
    this.db = drizzle(client, { schema });
    client.connect();
  }

  static get() {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return new Analytics();
  }

  async createPageEvent(event: PageEvent) {
    await this.db.insert(analyticsSchema.pageEvent).values(event);
  }

  async createTrackEvent(event: TrackEvent) {
    await this.db.insert(analyticsSchema.trackEvent).values(event);
  }

  async getDailyUsers() {
    return getDailyUsers(this.db);
  }

  async getPagesUsed() {
    return getPagesUsed(this.db);
  }
}
