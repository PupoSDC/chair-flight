import { useRouter } from "next/router";
import {
  AppHead,
  LayoutModuleAtpl,
  QuestionEditor,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

export const EditQuestionPage: NextPage = () => {
  const router = useRouter();
  const questionId = router.query["questionId"] as string;
  return (
    <LayoutModuleAtpl fixedHeight noPadding>
      <AppHead title={questionId} />
      <QuestionEditor questionBank="atpl" />
    </LayoutModuleAtpl>
  );
};

export const getServerSideProps = ssrHandler(async ({ helper, context }) => {
  const questionId = context.params?.["questionId"] as string;
  await helper.questionBank.getQuestionFromGithub.prefetch({
    questionId,
    questionBank: "atpl",
  });
});

export default EditQuestionPage;
