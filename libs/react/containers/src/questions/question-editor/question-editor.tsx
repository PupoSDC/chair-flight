import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid } from "@mui/joy";
import { questionEditSchema } from "@chair-flight/core/schemas";
import { trpc } from "@chair-flight/trpc/client";
import { RestoreFormHistory } from "../../hooks/use-form-history";
import { container, getRequiredParam } from "../../wraper/container";
import { EditQuestionBody } from "./components/edit-question-body";
import { EditQuestionHeader } from "./components/edit-question-header";
import { EditVariantModal } from "./components/edit-variant-modal";
import { EditVariants } from "./components/edit-variants";
import { ReviewPrModal } from "./components/review-pr-modal";
import type { EditQuestionFormValues } from "./types/edit-question-form-values";
import type {
  QuestionBankName,
  QuestionBankQuestionTemplate,
  QuestionId,
} from "@chair-flight/base/types";

const resolver = zodResolver(questionEditSchema);

type Props = {
  questionId: QuestionId;
  questionBank: QuestionBankName;
};

type Params = {
  questionId: QuestionId;
  questionBank: QuestionBankName;
};

type Data = {
  questionTemplate: QuestionBankQuestionTemplate;
};

export const QuestionEditor = container<Props, Params, Data>((props) => {
  const { questionBank, questionId, component, sx } = props;
  const { questionTemplate } = QuestionEditor.useData(props);

  const defaultValues: EditQuestionFormValues = {
    question: questionTemplate,
    questionBank: questionBank,
    requestData: {
      title: "",
      description: "",
    },
  };

  const form = useForm<EditQuestionFormValues>({
    resolver,
    defaultValues,
    mode: "onBlur",
  });

  return (
    <Box component={component} sx={sx}>
      <FormProvider {...form}>
        <EditQuestionHeader />
        <Grid container sx={{ flex: 1, overflow: "hidden", p: 2, ...sx }}>
          <Grid xs={12} md={6} lg={4}>
            <EditQuestionBody />
          </Grid>
          <Grid xs={12} md={6} lg={8} sx={{ height: "100%" }}>
            <EditVariants />
          </Grid>
        </Grid>
        <EditVariantModal />
        <ReviewPrModal />
        <RestoreFormHistory id={questionId} />
      </FormProvider>
    </Box>
  );
});

QuestionEditor.displayName = "QuestionEditor";

QuestionEditor.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const questionId = getRequiredParam(params, "questionId");

  return await helper.questionBank.getQuestionFromGithub.fetch({
    questionBank,
    questionId,
  });
};

QuestionEditor.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const questionId = getRequiredParam(params, "questionId");

  return trpc.questionBank.getQuestionFromGithub.useSuspenseQuery({
    questionBank,
    questionId,
  })[0];
};
