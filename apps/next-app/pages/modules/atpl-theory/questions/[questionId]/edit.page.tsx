import { useRouter } from "next/router";
import {
  AppLayout,
  HEADER_HEIGHT,
  Header,
} from "@chair-flight/react/components";
import {
  AppHead,
  AppHeaderMenu,
  QuestionEditor,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

export const EditQuestionPage: NextPage = () => {
  const router = useRouter();
  const questionId = router.query["questionId"] as string;
  return (
    <>
      <AppHead title={questionId} />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main
        sx={{
          height: {
            xs: "auto",
            md: `calc(100vh - ${HEADER_HEIGHT}px)`,
          },
        }}
      >
        <QuestionEditor />
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps = ssrHandler(async ({ helper, context }) => {
  const questionId = context.params?.["questionId"] as string;
  await helper.questions.getQuestionFromGithub.prefetch({ questionId });
});

export default EditQuestionPage;
