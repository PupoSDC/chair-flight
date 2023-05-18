import { createRef, useEffect, useId, useRef, useState } from "react";
import { default as Draggable } from "react-draggable";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
import { default as EditIcon } from "@mui/icons-material/Edit";
import { default as KeyboardArrowDown } from "@mui/icons-material/KeyboardArrowDown";
import { default as KeyboardArrowRight } from "@mui/icons-material/KeyboardArrowRight";
import { default as RadioButtonCheckedIcon } from "@mui/icons-material/RadioButtonChecked";
import { default as RadioButtonUncheckedIcon } from "@mui/icons-material/RadioButtonUnchecked";
import { default as SaveIcon } from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  List,
  Select,
  Option,
  Sheet,
  Textarea,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Divider,
  Grid,
} from "@mui/joy";
import axios from "axios";
import { useAppStore } from "libs/core/redux/src/store/store";
import {
  getQuestionPreview,
  getRandomIdGenerator,
} from "@chair-flight/core/app";
import {
  ReduxProvider,
  actions,
  useAppDispatch,
  useAppSelector,
} from "@chair-flight/core/redux";
import { AppHead, AppHeaderMenu } from "@chair-flight/next/client";
import { ssrHandler } from "@chair-flight/next/server";
import { questionSchema } from "@chair-flight/question-bank/schemas";
import {
  Header,
  AppLayout,
  QuestionVariantPreview,
  toast,
} from "@chair-flight/react/components";
import { AutoExpandTextArea } from "./components/AutoExpandTextArea";
import { FormSnippetEditVariant } from "./components/FormSnippetEditVariant";
import { EditDraggableVariant } from "./components/edit-draggable-variant";
import { EditQuestionBody } from "./components/edit-question-body";
import { InputAutocompleteLearningObjectives } from "./components/input-autocomplete-learning-objectives";
import type { PutBodySchema } from "../../api/questions/[questionId].api";
import type {
  QuestionTemplate,
  QuestionVariant,
  QuestionVariantType,
} from "@chair-flight/base/types";
import type { NextPage } from "next";

type QuestionPageProps = {
  question: QuestionTemplate;
};

const QuestionPageClient: NextPage<QuestionPageProps> = ({ question }) => {
  const dispatch = useAppDispatch();
  const hasPushedInitialHistory = useRef(false);
  const editedQuestion =
    useAppSelector(
      (state) => state.questionEditor.questions[question.id]?.currentVersion
    ) ?? question;
  const [openVariant, setOpenVariant] = useState<string | null>(null);

  useEffect(() => {
    if (hasPushedInitialHistory.current) return;
    dispatch(actions.resetQuestionEditor({ question }));
    hasPushedInitialHistory.current = true;
  });

  return (
    <>
      <AppLayout.Header>
        <Box sx={{ display: "flex", alignItems: "baseline" }}>
          <EditIcon sx={{ mx: 1 }} fontSize="xl2" />
          <Typography level="h4">
            {`Editing Question ${question.id}`}
          </Typography>
        </Box>
      </AppLayout.Header>
      <Grid container sx={{ flex: 1, overflow: "hidden" }}>
        <Grid xs={6} lg={4}>
          <EditQuestionBody questionId={question.id} />
        </Grid>
        <Grid xs={6} lg={8} sx={{ height: "100%" }}>
          <List
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              overflow: "scroll",
            }}
            children={Object.values(editedQuestion.variants).map((variant) => (
              <EditDraggableVariant
                key={variant.id}
                questionId={question.id}
                variantId={variant.id}
              />
            ))}
          />
        </Grid>
      </Grid>
      <Modal
        open={Boolean(openVariant)}
        onClose={() => toast.warn("Please save or discard your changes!")}
      >
        <ModalDialog>
          <Typography>Edit Variant</Typography>
          <Divider />
          <Box sx={{ display: "flex" }}>
            <Button
              color="danger"
              variant="outlined"
              onClick={() => setOpenVariant(null)}
              children="Discard"
            />
            <Button
              color="success"
              variant="solid"
              role="submit"
              children="Save"
              onClick={() => setOpenVariant(null)}
            />
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
};

export const QuestionPage: NextPage<QuestionPageProps> = ({ question }) => {
  return (
    <>
      <AppHead title={question.id} />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main>
        <ReduxProvider loading={"loading..."}>
          <QuestionPageClient question={question} />
        </ReduxProvider>
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps = ssrHandler<QuestionPageProps>(
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

export default QuestionPage;
