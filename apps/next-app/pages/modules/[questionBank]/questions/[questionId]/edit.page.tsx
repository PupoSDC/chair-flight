import { useRouter } from "next/router";
import {
  AppHead,
  LayoutModuleBank,
  QuestionEditor,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { NextPage } from "next";

type QuestionPageProps = {
  questionBank: QuestionBankName;
};

type QuestionPageParams = {
  questionId?: string;
  questionBank?: QuestionBankName;
};

export const EditQuestionPage: NextPage<
  QuestionPageProps,
  QuestionPageParams
> = ({ questionBank }) => {
  const router = useRouter();
  const questionId = router.query["questionId"] as string;
  return (
    <LayoutModuleBank questionBank={questionBank} fixedHeight noPadding>
      <AppHead title={questionId} />
      <QuestionEditor questionBank={questionBank} />
    </LayoutModuleBank>
  );
};

export const getServerSideProps = ssrHandler<QuestionPageProps>(
  async ({ helper, context }) => {
    const questionBank = context.params?.["questionBank"] as QuestionBankName;
    const questionId = context.params?.["questionId"] as string;

    await helper.questionBank.getQuestionFromGithub.fetch({
      questionId,
      questionBank,
    });

    return { props: { questionBank } };
  },
);

export default EditQuestionPage;
