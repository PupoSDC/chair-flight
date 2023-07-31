import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { trpc } from "@chair-flight/trpc/client";
import type { NextPage } from "next";

const data = [{ name: "Page A", uv: 400, pv: 2400, amt: 2400 }];

const useVisitsPerDay = trpc.analytics.visitsPerDay.useSuspenseQuery;

const AnalyticsPage: NextPage = () => {
  useVisitsPerDay();
  return (
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
    </LineChart>
  );
};

export async function getStaticProps() {
  return {
    props: {
      posts: [],
    },
    revalidate: 60 * 15,
  };
}

export default AnalyticsPage;
