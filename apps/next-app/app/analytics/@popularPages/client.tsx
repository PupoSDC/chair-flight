"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import type { FunctionComponent } from "react";

type ClientProps = {
  pagesUsed: {
    id: string;
    label: string;
    value: number;
  }[];
};

export const Client: FunctionComponent<ClientProps> = ({ pagesUsed }) => (
  <PieChart height={300} series={[{ data: pagesUsed }]} />
);
