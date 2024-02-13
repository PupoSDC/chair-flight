import * as fs from "node:fs/promises";
import { GlobalStyles, Sheet, Typography } from "@mui/joy";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { DateTime } from "luxon";
import { BlogIndex, LayoutPublic } from "@cf/next/public";
import { AppHead, BackgroundFadedImage } from "@cf/react/components";
import { trpc } from "@cf/trpc/client";
import { staticHandler } from "@cf/trpc/server";
import type { NextPage } from "next";

const Page: NextPage = () => {
  const dailyUsersQuery = trpc.common.analytics.getDailyUsers.useQuery();
  const pagesUsedQuery = trpc.common.analytics.getPagesUsed.useQuery();
  const dailyUsers = dailyUsersQuery.data?.dailyUsers ?? [];
  const pagesUsed = pagesUsedQuery.data?.pagesUsed ?? [];

  return (
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <AppHead />
      <GlobalStyles
        styles={(t) => ({
          ".MuiChartsTooltip-table": {
            backgroundColor: t.vars.palette.background.surface,
          },
        })}
      />
      <Typography level="h1">Analytics</Typography>

      <Typography level="h3" sx={{ mt: 3 }}>
        Daily Users
      </Typography>
      <Sheet sx={{ width: "100%", height: 400, p: 2 }}>
        <LineChart
          dataset={dailyUsers}
          xAxis={[
            {
              dataKey: "index",
              valueFormatter: (v) => {
                return DateTime.now()
                  .minus({ days: 29 - v })
                  .toFormat("dd/MM");
              },
              min: 1,
              max: 29,
            },
          ]}
          yAxis={[{ min: 0, max: 2000 }]}
          series={[
            {
              dataKey: "value",
              showMark: ({ index }) => index % 2 === 0,
            },
          ]}
          height={300}
        />
      </Sheet>

      <Typography level="h3" sx={{ mt: 2 }}>
        Most popular pages (last 7 days)
      </Typography>

      <Sheet sx={{ width: "100%", height: 350, p: 2 }}>
        <PieChart height={300} series={[{ data: pagesUsed }]} />
      </Sheet>
    </LayoutPublic>
  );
};

export const getStaticProps = staticHandler(async ({ helper }) => {
  await BlogIndex.getData({ params: {}, helper });
  return { props: {} };
}, fs);

export default Page;
