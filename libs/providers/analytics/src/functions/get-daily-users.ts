import { countDistinct, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { makeMap } from "@cf/base/utils";
import { analyticsSchema } from "../../drizzle";
import type { AnalyticsDb } from "../../drizzle";

export const getDailyUsers = async (db: AnalyticsDb) => {
  const pageEvent = analyticsSchema.pageEvent;
  const dbDailyUsers = (await db
    .select({
      date: sql`to_char(${pageEvent.timestamp}, 'YYYY-MM-DD')`,
      uniqueVisitors: countDistinct(pageEvent.anonymousId),
    })
    .from(pageEvent)
    .groupBy((q) => q.date)
    .orderBy((q) => desc(q.date))
    .limit(31)) as { date: string; uniqueVisitors: number }[];

  const dbDailyUsersMap = makeMap(dbDailyUsers, (row) => row.date);

  const dailyUsers = Array.from({ length: 30 }, (_, i) => {
    const date = DateTime.now().minus({ days: 29 - i });
    const visitors =
      dbDailyUsersMap[date.toFormat("yyyy-MM-dd")]?.uniqueVisitors ?? 0;
    return {
      index: i,
      value: visitors,
    };
  });

  return { dailyUsers };
};
