import * as schema from "./schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export const contentSchema = schema;
export type ContentSchema = typeof contentSchema;
export type ContentDb = NodePgDatabase<ContentSchema>;
