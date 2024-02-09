import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { analyticsSchema } from "../drizzle";
import { getDailyUsers } from "./functions/get-daily-users";
import type { AnalyticsDb } from "../drizzle";
import type { PageEvent } from "./entities/page-event";
import type { TrackEvent } from "./entities/track-event";

interface AnalyticsProvider {
  createPageEvent: (event: PageEvent) => Promise<void>;
  createTrackEvent: (event: TrackEvent) => Promise<void>;
}

export class Analytics implements AnalyticsProvider {
  private db: AnalyticsDb;

  constructor() {
    const schema = analyticsSchema;
    const pgProvider = getEnvVariableOrThrow("PROVIDER_POSTGRES_ANALYTICS");
    const client = new Client({ connectionString: pgProvider });
    this.db = drizzle(client, { schema });
    client.connect();
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
}
