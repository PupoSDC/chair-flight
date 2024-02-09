import * as schema from "./schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export const analyticsSchema = schema;
export type AnalyticsSchema = typeof schema;
export type AnalyticsDb = NodePgDatabase<AnalyticsSchema>;
