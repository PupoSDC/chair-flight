import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { pgTable, timestamp, text, integer, jsonb } from "drizzle-orm/pg-core";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";

const getEnv = () => getEnvVariableOrThrow("NODE_ENV");

export const pageEvent = pgTable("PageEvent", {
  id: text("id").primaryKey().notNull().$defaultFn(randomUUID),
  timestamp: timestamp("timestamp")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  environment: text("environment").notNull().$default(getEnv),
  anonymousId: text("anonymousId").notNull(),
  title: text("title").notNull(),
  height: integer("height").notNull(),
  width: integer("width").notNull(),
  path: text("path").notNull(),
  resolvedPath: text("resolvedPath").notNull(),
});

export const trackEvent = pgTable("TrackEvent", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID()),
  timestamp: timestamp("timestamp")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  environment: text("environment").notNull().$default(getEnv),
  anonymousId: text("anonymousId").notNull(),
  eventName: text("eventName").notNull(),
  properties: jsonb("properties").notNull(),
  path: text("path").notNull(),
  resolvedPath: text("resolvedPath").notNull(),
});
