import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@mui/joy";
import { questionEditSchema } from "@chair-flight/core/schemas";
import { trpc } from "@chair-flight/trpc/client";
import { RestoreFormHistory } from "../../hooks/use-form-history";
import { EditQuestionBody } from "./components/edit-question-body";
import { EditQuestionHeader } from "./components/edit-question-header";
import { EditVariantModal } from "./components/edit-variant-modal";
import { EditVariants } from "./components/edit-variants";
import { ReviewPrModal } from "./components/review-pr-modal";
import type { EditQuestionFormValues } from "./types/edit-question-form-values";
import type { FunctionComponent } from "react";

const resolver = zodResolver(questionEditSchema);

export type QuestionEditorProps = {
  questionBank: "737" | "Atpl";
};

export const QuestionEditor: FunctionComponent<QuestionEditorProps> = ({
  questionBank,
}) => {
  const trpcBank = trpc[`questionBank${questionBank}`];
  const useQuestion = trpcBank.getQuestionFromGithub.useSuspenseQuery;

  const router = useRouter();
  const questionId = router.query["questionId"] as string;
  const [{ questionTemplate }] = useQuestion({ questionId });

  const defaultValues: EditQuestionFormValues = {
    question: questionTemplate,
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
    <FormProvider {...form}>
      <EditQuestionHeader />
      <Grid container sx={{ flex: 1, overflow: "hidden", p: 2 }}>
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
  );
};
