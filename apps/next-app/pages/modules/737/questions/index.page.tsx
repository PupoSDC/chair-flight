import {
  AppHead,
  LayoutModule737,
  QuestionSearch,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const QuestionsIndexPage: NextPage = () => (
  <LayoutModule737>
    <AppHead />
    <QuestionSearch
      component="section"
      searchQuestions={trpc.questionBank737.searchQuestions}
      getNumberOfQuestions={trpc.questionBank737.getNumberOfQuestions}
    />
  </LayoutModule737>
);

export const getStaticProps: GetStaticProps = async () => {
  await preloadContentForStaticRender(await import("fs/promises"));
  const helper = await getTrpcHelper();
  await Promise.all([helper.questionBank737.getNumberOfQuestions.fetch()]);

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default QuestionsIndexPage;
