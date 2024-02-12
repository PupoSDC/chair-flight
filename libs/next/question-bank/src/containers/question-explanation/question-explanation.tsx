import { Stack } from "@mui/joy";
import { Ups } from "@chair-flight/react/components";
import { Markdown } from "@chair-flight/react/markdown";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "@chair-flight/trpc/client";
import type {
  QuestionBankName,
  QuestionTemplateId,
} from "@chair-flight/core/question-bank";
import type { CommonComponentProps } from "@chair-flight/trpc/client";
import type { AppRouterOutput } from "@chair-flight/trpc/client";
import type { FunctionComponent } from "react";

type Props = {
  questionBank: QuestionBankName;
  questionId: QuestionTemplateId;
};

type Params = {
  questionBank: QuestionBankName;
  questionId: QuestionTemplateId;
};

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionExplanation"];

export const QuestionExplanationComponent: FunctionComponent<
  CommonComponentProps & Data
> = ({ sx, component = "section", explanation }) => {
  return (
    <Stack component={component} sx={sx}>
      {explanation ? (
        <Markdown children={explanation} />
      ) : (
        <Ups message="No explanation to this question is available" />
      )}
    </Stack>
  );
};

export const QuestionExplanation = container<Props, Params, Data>((props) => {
  const params = QuestionExplanation.useData(props);
  return <QuestionExplanationComponent {...props} {...params} />;
});

QuestionExplanation.displayName = "QuestionExplanation";

QuestionExplanation.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  const questionId = getRequiredParam(params, "questionId");
  return await router.getQuestionExplanation.fetch({
    questionBank,
    questionId,
  });
};

QuestionExplanation.useData = (params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  const questionId = getRequiredParam(params, "questionId");
  return router.getQuestionExplanation.useSuspenseQuery({
    questionBank,
    questionId,
  })[0];
};
