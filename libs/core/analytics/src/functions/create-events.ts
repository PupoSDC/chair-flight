import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { prisma } from "../config/postgres-connection";
import type { PageEvent, SimplifiedTrackEvent } from "../types";
import type { Prisma } from "@prisma/client";

const environment = getEnvVariableOrThrow("NODE_ENV");

export const createPageEvent = async (event: PageEvent) => {
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

export const createTrackEvent = async (event: SimplifiedTrackEvent) => {
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
