import { QuestionMeta } from "@cf/next/question-bank";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type TestMetaPageProps = {
  searchParams: {
    templateId: string;
    questionBank: QuestionBankName;
  };
};

const TestMetaPage: FunctionComponent<TestMetaPageProps> = async ({
  searchParams: { templateId, questionBank },
}) => {
  // TODO throw error and render error boundary https://github.com/vercel/next.js/issues/62954
  if (!templateId) return null;
  if (!questionBank) return null;

  return <QuestionMeta questionId={templateId} questionBank={questionBank} />;
};

export default TestMetaPage;
