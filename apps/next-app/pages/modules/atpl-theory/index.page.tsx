import {
  AppHead,
  LayoutModuleAtpl,
  TestsOverview,
} from "@chair-flight/react/containers";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const ModuleIndexPage: NextPage = () => (
  <LayoutModuleAtpl>
    <AppHead />
    <section>
      <TestsOverview />
    </section>
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

export default ModuleIndexPage;
