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
    <LayoutModuleAtpl noPadding fixedHeight>
      <AppHead title={questionId} />
      <QuestionEditor />
    </LayoutModuleAtpl>
  );
};

export const getServerSideProps = ssrHandler(async ({ helper, context }) => {
  const questionId = context.params?.["questionId"] as string;
  await helper.questionBankAtpl.getQuestionFromGithub.prefetch({ questionId });
});

export default EditQuestionPage;
