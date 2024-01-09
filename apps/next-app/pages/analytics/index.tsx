import *  as fs from "fs/promises";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { trpc } from "@chair-flight/trpc/client";
import { staticHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

const useVisitsPerDay = trpc.analytics.visitsPerDay.useSuspenseQuery;

const AnalyticsPage: NextPage = () => {
  const [{ views, paths }] = useVisitsPerDay();
  return (
    <LineChart width={400} height={400} data={views}>
      {paths.map((path) => (
        <Line key={path} type="monotone" dataKey={path} stroke="#8884d8" />
      ))}
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
    </LineChart>
  );
};

export const getStaticProps = staticHandler(async ({ helper }) => {
  await helper.analytics.visitsPerDay.prefetch();
  return { props: {}, revalidate: 60 * 15 };
}, fs);

export default AnalyticsPage;
