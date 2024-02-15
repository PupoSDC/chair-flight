import { default as OpenInNewIcon } from "@mui/icons-material/OpenInNewOutlined";
import { Button, Divider, Link } from "@mui/joy";
import { QuestionExplanation } from "@cf/next/question-bank";
import { QuestionMeta } from "@cf/next/question-bank";
import { container } from "@cf/trpc/client";
import { useTestProgress } from "../../hooks/use-test-progress";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { TestId } from "@cf/core/tests";

type Props = {
  testId: TestId;
  questionBank: QuestionBankName;
  noSsr: true;
};

export const TestQuestionMeta = container<Props>(({ testId, questionBank }) => {
  const test = useTestProgress((state) => state.tests[testId]);
  const question = test.questions[test.currentQuestionIndex];

  return (
    <>
      <Button
        component={Link}
        variant="outlined"
        target="_blank"
        startDecorator={<OpenInNewIcon />}
        href={`/modules/${questionBank}/questions/${question.templateId}`}
        children="Explore Question"
      />
      <Divider sx={{ my: 2 }}>Explanation</Divider>
      <QuestionExplanation
        questionBank={questionBank}
        questionId={question.templateId}
      />
      <Divider sx={{ my: 2 }}>Meta</Divider>
      <QuestionMeta
        questionBank={questionBank}
        questionId={question.templateId}
        forceMode="mobile"
      />
    </>
  );
});

TestQuestionMeta.useData = () => ({});
TestQuestionMeta.getData = async () => ({});
