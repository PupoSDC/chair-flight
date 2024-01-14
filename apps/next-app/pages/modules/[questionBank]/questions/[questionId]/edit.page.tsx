import { MissingPathParameter } from "@chair-flight/base/errors";
import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, QuestionEditor } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
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
}) => (
  <LayoutModule questionBank={questionBank} fixedHeight noPadding>
    <AppHead title={questionId} />
    <QuestionEditor questionBank={questionBank} questionId={questionId} />
  </LayoutModule>
);

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    const { questionId, questionBank } = params;
    if (!questionId) throw new MissingPathParameter("questionId");
    if (!questionBank) throw new MissingPathParameter("questionBank");

    await Promise.all([
      LayoutModule.getData({ params, helper }),
      QuestionEditor.getData({ params, helper }),
    ]);

    return { props: params };
  },
);

export default EditQuestionPage;
