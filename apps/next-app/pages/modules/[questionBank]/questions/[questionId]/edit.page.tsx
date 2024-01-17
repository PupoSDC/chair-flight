import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, QuestionEditor } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type PageProps = {
  questionId: string;
  questionBank: QuestionBankName;
};

type PageParams = {
  questionId: string;
  questionBank: QuestionBankName;
};

export const EditQuestionPage: NextPage<PageProps, PageParams> = ({
  questionBank,
  questionId,
}) => {
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Questions", `/modules/${questionBank}/questions`],
    [questionId, `/modules/${questionBank}/questions/${questionId}`],
    "edit",
  ] as Breadcrumbs;

  return (
    <LayoutModule
      questionBank={questionBank}
      breadcrumbs={crumbs}
      fixedHeight
      noPadding
    >
      <AppHead title={questionId} />
      <QuestionEditor questionBank={questionBank} questionId={questionId} />
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await Promise.all([
      LayoutModule.getData({ params, helper }),
      QuestionEditor.getData({ params, helper }),
    ]);

    return { props: params };
  },
);

export default EditQuestionPage;
