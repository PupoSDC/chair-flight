import { useRouter } from "next/router";
import {
  AppHead,
  LayoutModule737,
  QuestionEditor,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

export const EditQuestionPage: NextPage = () => {
  const router = useRouter();
  const questionId = router.query["questionId"] as string;
  return (
    <LayoutModule737 fixedHeight noPadding>
      <AppHead title={questionId} />
      <QuestionEditor questionBank="737" />
    </LayoutModule737>
  );
};

export const getServerSideProps = ssrHandler(async ({ helper, context }) => {
  const questionBank = "737";
  const questionId = context.params?.["questionId"] as string;
  await helper.questionBank.getQuestionFromGithub.prefetch({
    questionId,
    questionBank,
  });
});

export default EditQuestionPage;
