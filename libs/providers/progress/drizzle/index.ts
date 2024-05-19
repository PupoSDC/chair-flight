import * as schema from "./schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export const userProgressSchema = schema;
export type UserProgressSchema = typeof schema;
export type UserProgressDb = NodePgDatabase<UserProgressSchema>;
