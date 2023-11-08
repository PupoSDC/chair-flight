import {
  AppHead,
  LayoutModuleAtpl,
  TestsOverview,
} from "@chair-flight/react/containers";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const TestsIndexPage: NextPage = () => (
  <LayoutModuleAtpl>
    <AppHead />
    <TestsOverview component={"section"} questionBank="atpl" />
  </LayoutModuleAtpl>
);

export const getStaticProps: GetStaticProps = async () => {
  const helper = await getTrpcHelper();
  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default TestsIndexPage;
