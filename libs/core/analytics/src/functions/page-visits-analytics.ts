import { DateTime } from "luxon";
import { prisma } from "../config/postgres-connection";

const FirstDateWeCareAbout = new Date("2023-07-30");

export const getPageVisits = async () => {
  const data = await prisma.pageEventDailyCount.findMany({
    where: {
      timestamp: {
        gte: FirstDateWeCareAbout,
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  const views = data.reduce<Array<Record<string, string | number>>>(
    (acc, curr) => {
      const { timestamp, path, count } = curr;
      const name = DateTime.fromJSDate(timestamp).toFormat("yyyy-MM-dd");
      let existingDate = acc.find((item) => item["name"] === name);
      if (!existingDate) acc.push({ name });
      existingDate ??= acc.at(-1)!;
      existingDate[path] = count;
      return acc;
    },
    [],
  );

  const paths = data.reduce<string[]>((acc, curr) => {
    const { path } = curr;
    if (!acc.includes(path)) acc.push(path);
    return acc;
  }, []);
  return { views, paths };
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
      count,
      "timestamp2" as "timestamp",
      environment,
      path
    FROM (
          SELECT 
            COUNT(*)::integer as "count",
            DATE_TRUNC('day', timestamp) as "timestamp2",
            environment as "environment",
            path as "path"
          FROM "PageEvent"
          WHERE "timestamp" >= ${firstDay}
          GROUP BY "timestamp2", "path", "environment"
          ORDER BY "timestamp2" ASC
    ) as subquery
    ORDER BY "timestamp2" ASC;
  `;

  await prisma.pageEventDailyCount.createMany({
    data: dailyCounts,
    skipDuplicates: true,
  });
};
