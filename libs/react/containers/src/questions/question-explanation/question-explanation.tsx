import { Stack } from "@mui/joy";
import { Markdown, Ups } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import type { CommonComponentProps } from "../../wraper/container";
import type {
  QuestionBankName,
  QuestionTemplateId,
} from "@chair-flight/core/question-bank";
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
  CommonComponentProps & Props & Data
> = ({ sx, component = "section", explanation }) => {
  return (
    <Stack component={component} sx={sx}>
      {explanation ? (
        <Markdown document={explanation} />
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
