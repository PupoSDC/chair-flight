import { DateTime } from "luxon";
import { prisma } from "../config/postgres-connection";

const FirstDateWeCareAbout = new Date("2023-07-30");

export const getPageVisits = async () => {
  return await prisma.pageEventDailyCount.findMany({
    where: {
      timestamp: {
        gte: FirstDateWeCareAbout,
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  });
};

export const generateDailyCounts = async () => {
  const lastCalculateCount = await prisma.pageEventDailyCount.findFirst({
    orderBy: {
      timestamp: "desc",
    },
  });

  const lastDay = lastCalculateCount?.timestamp ?? FirstDateWeCareAbout;
  const yesterday = DateTime.now().minus({ days: 1 }).toJSDate();
  const firstDay = lastDay < yesterday ? lastDay : yesterday;

  type DailyCount = {
    count: number;
    timestamp: Date;
    environment: string;
    path: string;
  };

  const dailyCounts = await prisma.$queryRaw<DailyCount[]>`
        SELECT 
          COUNT(*) as "count"
          Date(timestamp) as "timestamp"
          environment as "environment"
          path as "path"
        FROM "PageEvent"
        GROUP BY "date", "path", "environment"
        ORDER BY "date" ASC
        WHERE "timestamp" >= ${firstDay}
    `;

  await prisma.pageEventDailyCount.createMany({
    data: dailyCounts,
    skipDuplicates: true,
  });
};
