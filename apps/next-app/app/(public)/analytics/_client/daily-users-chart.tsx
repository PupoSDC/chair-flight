"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { DateTime } from "luxon";
import type { Analytics } from "@cf/providers/analytics";
import type { FunctionComponent } from "react";

export const DailyUsersChart: FunctionComponent<{
  dailyUsers: Awaited<ReturnType<Analytics["getDailyUsers"]>>["dailyUsers"];
}> = ({ dailyUsers }) => (
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
    yAxis={[{ min: 0, max: 50 }]}
    series={[
      {
        dataKey: "value",
        showMark: ({ index }) => index % 2 === 0,
      },
    ]}
    height={300}
    sx={{}}
  />
);
