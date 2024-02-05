import { PrismaClient } from "@prisma/client";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { createPageEvent, createTrackEvent } from "./functions/create-events";
import type { PageEvent } from "./entities/page-event";
import type { TrackEvent } from "./entities/track-event";

interface AnalyticsProvider {
  createPageEvent: (event: PageEvent) => Promise<void>;
  createTrackEvent: (event: TrackEvent) => Promise<void>;
}

export class Analytics implements AnalyticsProvider {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: getEnvVariableOrThrow("PROVIDER_POSTGRES_ANALYTICS_PRISMA_URL"),
        },
      },
    });
  }

  async createPageEvent(event: PageEvent) {
    return createPageEvent(this.prisma, event);
  }

  async createTrackEvent(event: TrackEvent) {
    return createTrackEvent(this.prisma, event);
  }
}
