import { useTheme } from "@mui/joy";
import { HEADER_HEIGHT, Header } from "@chair-flight/react/components";
import {
  AppHead,
  QuestionSearch,
  Sidebar737,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

const QuestionsIndexPage: NextPage = () => {
  const theme = useTheme();

  return (
    <>
      <AppHead />
      <Header borderStyle="outlined" />
      <main>
        <Sidebar737 />
        <QuestionSearch
          component={"section"}
          searchQuestions={trpc.questionBank737.searchQuestions}
          getNumberOfQuestions={trpc.questionBank737.getNumberOfQuestions}
          sx={{
            minHeight: HEIGHT,
            width: `var(${theme.dimensions.vars.sidebarRemainingWidth})`,
            marginLeft: "auto",
            marginRight: 0,
            p: { xs: 0.5, md: 2 },
            transition: "margin-left 0.25s, width 0.25s",
          }}
        />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const helper = await getTrpcHelper();
  await Promise.all([helper.questionBank737.getNumberOfQuestions.fetch()]);

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default QuestionsIndexPage;
