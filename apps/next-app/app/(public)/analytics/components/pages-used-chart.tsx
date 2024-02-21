"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import type { Analytics } from "@cf/providers/analytics";
import type { FunctionComponent } from "react";

export const PagesUsedChart: FunctionComponent<{
  pagesUsed: Awaited<ReturnType<Analytics["getPagesUsed"]>>["pagesUsed"];
}> = ({ pagesUsed }) => (
  <PieChart height={300} series={[{ data: pagesUsed }]} />
);
