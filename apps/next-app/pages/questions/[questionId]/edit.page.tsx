import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid } from "@mui/joy";
import { questionSchema } from "@chair-flight/core/schemas";
import { AppLayout, Header } from "@chair-flight/react/components";
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
import type { NextPage } from "next";

const resolver = zodResolver(questionSchema);

export const EditQuestionPage: NextPage = () => {
  const { query } = useRouter();
  const questionId = query["questionId"] as string;

  const { mutateAsync: updateQuestion } =
    trpc.questions.updateQuestion.useMutation();

  const [{ questionTemplate: defaultValues }] =
    trpc.questions.getQuestionFromGithub.useSuspenseQuery({ questionId });

  const form = useForm({ resolver, defaultValues, mode: "onBlur" });

  const onSubmit = form.handleSubmit(async (editedQuestion) => {
    // toast.promise(updateQuestion({ question: editedQuestion }), {
    //   loading: "Saving...",
    //   error: "Failed to save",
    //   success: (response) => {
    //     router.push(`/questions/${question.id}`);
    //     dispatch(actions.deleteEditorState({ questionId: question.id }));
    //     return (
    //       <Typography>
    //         Saved <br />
    //         <Link href={response.url} target="_blank">
    //           You can follow up on github!
    //         </Link>
    //       </Typography>
    //     );
    //   },
    // });
  });

  return (
    <>
      <AppHead title={questionId} />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main>
        <FormProvider {...form}>
          <Box>
            <EditQuestionHeader />
            <Grid container sx={{ flex: 1, overflow: "hidden" }}>
              <Grid xs={6} lg={4}>
                <EditQuestionBody />
              </Grid>
              <Grid xs={6} lg={8} sx={{ height: "100%" }}>
                <EditVariants />
              </Grid>
            </Grid>
          </Box>
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
