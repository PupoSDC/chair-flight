import { countDistinct, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { analyticsSchema } from "../../drizzle";
import type { AnalyticsDb } from "../../drizzle";

export const getDailyUsers = async (db: AnalyticsDb) => {
  const pageEvent = analyticsSchema.pageEvent;
  return (await db
    .select({
      date: sql`to_char(${pageEvent.timestamp}, 'YYYY-MM-DD')`,
      uniqueVisitors: countDistinct(pageEvent.anonymousId),
    })
    .from(pageEvent)
    .groupBy((q) => q.date)
    .orderBy((q) => desc(q.date))
    .limit(31)) as { date: string; uniqueVisitors: number }[];
};
