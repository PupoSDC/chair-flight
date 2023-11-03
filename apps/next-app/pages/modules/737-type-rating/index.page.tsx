import { Header } from "@chair-flight/react/components";
import { AppHead, Sidebar737 } from "@chair-flight/react/containers";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const ModuleIndexPage: NextPage = () => {
  return (
    <>
      <AppHead />
      <Header borderStyle="outlined" />
      <Sidebar737 />
      <main></main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const helper = await getTrpcHelper();
  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default ModuleIndexPage;
