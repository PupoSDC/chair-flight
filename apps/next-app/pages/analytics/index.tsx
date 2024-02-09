import * as fs from "node:fs/promises";
import { GlobalStyles } from "@mui/joy";
import { LineChart } from "@mui/x-charts/LineChart";
import { AppHead, BackgroundFadedImage } from "@chair-flight/react/components";
import { BlogIndex, LayoutPublic } from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { staticHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

const Page: NextPage = () => {
  const { data = [] } = trpc.common.analytics.getDailyUsers.useQuery();

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

      <LineChart
        series={[
          {
            data: data.map((v) => v.uniqueVisitors),
            label: "Unique Visitors",
            color: "primary",
          },
        ]}
        width={500}
        height={300}
      />
    </LayoutPublic>
  );
};

export const getStaticProps = staticHandler(async ({ helper }) => {
  await BlogIndex.getData({ params: {}, helper });
  return { props: {} };
}, fs);

export default Page;
