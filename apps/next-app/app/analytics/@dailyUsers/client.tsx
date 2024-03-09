"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { DateTime } from "luxon";
import type { FunctionComponent } from "react";

type ClientProps = {
  dailyUsers: {
    index: number;
    value: number;
  }[];
};

export const Client: FunctionComponent<ClientProps> = ({ dailyUsers }) => (
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
);
