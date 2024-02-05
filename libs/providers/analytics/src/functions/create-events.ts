import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import type { PageEvent } from "../entities/page-event";
import type { TrackEvent } from "../entities/track-event";
import type { Prisma, PrismaClient } from "@prisma/client";

const environment = getEnvVariableOrThrow("NODE_ENV");

export const createPageEvent = async (
  prisma: PrismaClient,
  event: PageEvent,
) => {
  await prisma.pageEvent.create({
    data: {
      environment,
      timestamp: new Date(event.timestamp),
      anonymousId: event.anonymousId,
      title: event.title,
      path: event.path,
      resolvedPath: event.resolvedPath,
      height: event.height,
      width: event.width,
      referrer: event.referrer ?? "",
    },
  });
};

export const createTrackEvent = async (
  prisma: PrismaClient,
  event: TrackEvent,
) => {
  await prisma.trackEvent.create({
    data: {
      environment,
      timestamp: new Date(event.timestamp),
      anonymousId: event.anonymousId,
      eventName: event.eventName,
      path: event.path,
      resolvedPath: event.resolvedPath,
      properties: event.properties as Prisma.InputJsonValue,
    },
  });
};
