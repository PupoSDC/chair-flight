import { PrismaClient } from "@prisma/client";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { PageEvent } from "./entities/page-event";
import { TrackEvent } from "./entities/track-event";
import { createPageEvent, createTrackEvent } from "./functions/create-events";

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

  createPageEvent = async (event: PageEvent) =>
    createPageEvent(this.prisma, event);

  createTrackEvent = async (event: TrackEvent) =>
    createTrackEvent(this.prisma, event);
}
