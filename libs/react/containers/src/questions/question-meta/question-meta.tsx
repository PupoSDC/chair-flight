import { Grid, Link, Sheet, Stack, Typography } from "@mui/joy";
import {
  LearningObjectiveList,
  QuestionList,
  QuestionMultipleChoice,
  Ups,
} from "@chair-flight/react/components";
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
  onNavigateToNewSeed?: (args: { seed: string }) => void;
};

type Params = {
  questionBank: QuestionBankName;
  questionId: QuestionTemplateId;
};

type Data = AppRouterOutput["containers"]["questions"]["getQuestionMeta"];

export const QuestionMetaComponent: FunctionComponent<
  CommonComponentProps & Props & Data
> = ({
  sx,
  component = "section",
  learningObjectives,
  relatedQuestions,
  externalIds,
}) => {
  return (
    <Stack component={component} sx={sx}>
      <Typography level="h3" sx={{ mt: 2 }}>
        Learning Objectives
      </Typography>
      <LearningObjectiveList items={learningObjectives.items} />
      <Typography level="h3" sx={{ mt: 2 }}>
        Related Questions
      </Typography>
      <QuestionList items={relatedQuestions.items} />
      <Typography level="h3" sx={{ mt: 2 }}>
        External References
      </Typography>
      <Sheet sx={{ p: 1 }}>
        {externalIds.length > 0 ? (
          <Grid container>
            {externalIds.map((ref) => (
              <Grid key={ref.id} xs={6} md={3} lg={3}>
                <Link href={""} disabled>
                  <span>{ref.id}</span>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Ups message="No External References" />
        )}
      </Sheet>
    </Stack>
  );
};

export const QuestionMeta = container<Props, Params, Data>((props) => {
  const data = QuestionMeta.useData(props);
  return <QuestionMetaComponent {...props} {...data} />;
});

QuestionMeta.displayName = "QuestionMeta";

QuestionMeta.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  const questionId = getRequiredParam(params, "questionId");
  return await router.getQuestionMeta.fetch({
    questionBank,
    questionId,
  });
};

QuestionMeta.useData = (params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  const questionId = getRequiredParam(params, "questionId");
  return router.getQuestionMeta.useSuspenseQuery({
    questionBank,
    questionId,
  })[0];
};

QuestionMeta.LoadingFallback = ({ sx }) => (
  <Stack sx={sx}>
    <QuestionMultipleChoice loading />
  </Stack>
);
