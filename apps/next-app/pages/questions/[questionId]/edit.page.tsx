import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@mui/joy";
import { questionEditSchema } from "@chair-flight/core/schemas";
import {
  AppLayout,
  HEADER_HEIGHT,
  Header,
} from "@chair-flight/react/components";
import {
  AppHead,
  AppHeaderMenu,
  RestoreFormHistory,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { ssrHandler } from "@chair-flight/trpc/server";
import { EditQuestionBody } from "./components/edit-question-body";
import { EditQuestionHeader } from "./components/edit-question-header";
import { EditVariantModal } from "./components/edit-variant-modal";
import { EditVariants } from "./components/edit-variants";
import { ReviewPrModal } from "./components/review-pr-modal";
import type { EditQuestionFormValues } from "./types/edit-question-form-values";
import type { NextPage } from "next";

const resolver = zodResolver(questionEditSchema);

export const EditQuestionPage: NextPage = () => {
  const router = useRouter();
  const questionId = router.query["questionId"] as string;

  const [{ questionTemplate }] =
    trpc.questions.getQuestionFromGithub.useSuspenseQuery({ questionId });

  const defaultValues: EditQuestionFormValues = {
    question: questionTemplate,
    requestData: {
      title: "",
      description: "",
    },
  };

  const form = useForm({ resolver, defaultValues, mode: "onBlur" });

  return (
    <>
      <AppHead title={questionId} />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main
        sx={{
          height: {
            xs: "auto",
            md: `calc(100vh - ${HEADER_HEIGHT}px)`,
          },
        }}
      >
        <FormProvider {...form}>
          <EditQuestionHeader />
          <Grid container sx={{ flex: 1, overflow: "hidden" }}>
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
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps = ssrHandler(async ({ helper, context }) => {
  const questionId = context.params?.["questionId"] as string;
  await helper.questions.getQuestionFromGithub.prefetch({ questionId });
});

export default EditQuestionPage;
