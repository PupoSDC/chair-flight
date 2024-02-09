import * as fs from "node:fs/promises";
import { GlobalStyles } from "@mui/joy";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { AppHead, BackgroundFadedImage } from "@chair-flight/react/components";
import { BlogIndex, LayoutPublic } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

const Page: NextPage = () => {
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
      <BarChart
        series={[
          { data: [35, 44, 24, 34] },
          { data: [51, 6, 49, 30] },
          { data: [15, 25, 30, 50] },
          { data: [60, 50, 15, 25] },
        ]}
        height={290}
        xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
      />
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
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
