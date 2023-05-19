import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { default as EditIcon } from "@mui/icons-material/Edit";
import { Box, List, Typography, Grid, FormLabel, Button } from "@mui/joy";
import axios from "axios";
import {
  ReduxProvider,
  actions,
  useAppDispatch,
  useAppSelector,
} from "@chair-flight/core/redux";
import { AppHead, AppHeaderMenu } from "@chair-flight/next/client";
import { ssrHandler } from "@chair-flight/next/server";
import { AppLayout, Header, toast } from "@chair-flight/react/components";
import { EditQuestionBody } from "./components/edit-question-body";
import { EditVariant } from "./components/edit-variant";
import { EditVariantModal } from "./components/edit-variant-modal";
import type { PutBodySchema } from "../../api/questions/[questionId].api";
import type { QuestionTemplate } from "@chair-flight/base/types";
import type { NextPage } from "next";

type EditQuestionPageProps = {
  question: QuestionTemplate;
};

const EditQuestionPageClient: NextPage<EditQuestionPageProps> = ({
  question,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasShownStartMessage = useRef(false);
  const editor = useAppSelector((s) => s.questionEditor.questions[question.id]);
  const editedQuestion = editor?.currentVersion ?? question;
  const hasChanges = (editor?.history.length ?? 0) > 0;
  const variants = Object.values(editedQuestion.variants);

  useEffect(() => {
    if (hasShownStartMessage.current) return;
    const reset = () => dispatch(actions.resetQuestionEditor({ question }));
    if (editor) {
      toast.message("A previous work in progress was recovered.", {
        cancel: {
          label: "Load latest server data",
          onClick: reset,
        },
      });
    } else {
      reset();
    }
    hasShownStartMessage.current = true;
  }, [editor, question, dispatch]);

  const submitQuestion = async () => {
    await toast.promise(
      axios.put<void, void, PutBodySchema>(`/api/questions/${question.id}`, {
        question: editedQuestion,
      }),
      {
        loading: "Saving...",
        error: "Failed to save",
        success: () => {
          router.push(`/questions/${question.id}`);
          dispatch(actions.deleteEditorState({ questionId: question.id }));
          return "Saved!";
        },
      }
    );
  };

  return (
    <>
      <AppLayout.Header>
        <Box sx={{ display: "flex", alignItems: "baseline" }}>
          <EditIcon sx={{ mx: 1 }} fontSize="xl2" />
          <Typography level="h4">
            {`Editing Question ${question.id}`}
          </Typography>
        </Box>
        <Button
          sx={{ ml: "auto" }}
          color="success"
          disabled={!hasChanges}
          onClick={submitQuestion}
          children={"Save"}
        />
      </AppLayout.Header>
      <Grid container sx={{ flex: 1, overflow: "hidden" }}>
        <Grid xs={6} lg={4}>
          <EditQuestionBody questionId={question.id} />
        </Grid>
        <Grid xs={6} lg={8} sx={{ height: "100%" }}>
          <FormLabel sx={{ ml: 1 }}>
            {`Variants (${variants.length})`}
          </FormLabel>
          <List
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              overflow: "scroll",
            }}
            children={variants.map((variant) => (
              <EditVariant
                key={variant.id}
                questionId={question.id}
                variantId={variant.id}
              />
            ))}
          />
        </Grid>
      </Grid>
      <EditVariantModal />
    </>
  );
};

export const EditQuestionPage: NextPage<EditQuestionPageProps> = ({
  question,
}) => {
  return (
    <>
      <AppHead title={question.id} />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main>
        <ReduxProvider loading={"loading..."}>
          <EditQuestionPageClient question={question} />
        </ReduxProvider>
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps = ssrHandler<EditQuestionPageProps>(
  async ({ context, questionBank }) => {
    const questionId = context.params?.["questionId"] as string;
    const question = await questionBank.getQuestionTemplate(questionId);
    return {
      props: {
        question,
      },
    };
  }
);

export default EditQuestionPage;
