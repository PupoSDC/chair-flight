import { sql, gte, count } from "drizzle-orm";
import { analyticsSchema } from "../../drizzle";
import type { AnalyticsDb } from "../../drizzle";

export const getPagesUsed = async (db: AnalyticsDb) => {
  const pageEvent = analyticsSchema.pageEvent;
  const dbPagesUsed = await db
    .select({
      path: pageEvent.path,
      count: count(pageEvent.path),
    })
    .from(pageEvent)
    .where(gte(pageEvent.timestamp, sql`CURRENT_DATE - INTERVAL '7 days'`))
    .groupBy((q) => q.path);

  const pagesUsed = dbPagesUsed.map((row) => ({
    id: row.path,
    label: row.path,
    value: row.count,
  }));

  return { pagesUsed };
};
