import {
  AppHead,
  LayoutModule737,
  QuestionSearch,
} from "@chair-flight/react/containers";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const QuestionsIndexPage: NextPage = () => {
  return (
    <LayoutModule737>
      <AppHead />
      <QuestionSearch component="section" questionBank="737" />
    </LayoutModule737>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  await preloadContentForStaticRender(await import("fs/promises"));
  const helper = await getTrpcHelper();

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default QuestionsIndexPage;
