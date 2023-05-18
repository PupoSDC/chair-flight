import { createRef, useEffect, useId, useRef, useState } from "react";
import { default as Draggable } from "react-draggable";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
import { default as KeyboardArrowDown } from "@mui/icons-material/KeyboardArrowDown";
import { default as KeyboardArrowRight } from "@mui/icons-material/KeyboardArrowRight";
import { default as RadioButtonCheckedIcon } from "@mui/icons-material/RadioButtonChecked";
import { default as RadioButtonUncheckedIcon } from "@mui/icons-material/RadioButtonUnchecked";
import { default as EditIcon } from '@mui/icons-material/Edit';
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
import { LearningObjectivesAutoComplete } from "./components/LearningObjectivesAutoComplete";
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
  const editedQuestion = useAppSelector(
    (state) => state.questionEditor.questions[question.id]?.history?.at(-1)
  ) ?? question;
  const [openVariant, setOpenVariant] = useState<string | null>(null);

  useEffect(() => {
    if (hasPushedInitialHistory.current) return;
    dispatch(actions.updateQuestionTemplate({ question }));
    hasPushedInitialHistory.current = true;
  });

  const mergeVariant = (fromVariantId: string, toVariantId: string) => {
    if (fromVariantId === toVariantId) return;
    dispatch(
      actions.mergeQuestionVariants({
        questionId: question.id,
        fromVariantId,
        toVariantId,
      })
    );
    toast.success(`${fromVariantId} merged into ${toVariantId}`, {
      duration: 8000,
      action: {
        label: "Revert",
        onClick: () =>
          dispatch(
            actions.undoQuestionEditorLastChange({
              questionId: question.id,
            })
          ),
      },
    });
  };

  const deleteVariant = (variantId: string) => {
    dispatch(
      actions.deleteQuestionVariant({
        questionId: question.id,
        variantId,
      })
    );
    toast.success(`${variantId} deleted`, {
      duration: 8000,
      action: {
        label: "Revert",
        onClick: () =>
          dispatch(
            actions.undoQuestionEditorLastChange({
              questionId: question.id,
            })
          ),
      },
    });
  };

  const updateLearningObjectives = (learningObjectives: string[]) => {
    dispatch(actions.updateQuestionLearningObjectives({
      questionId: question.id,
      learningObjectives
    }));
  } 

  const addNewVariant = () => {
  }

  return (
    <>
      <AppLayout.Header>
        <Box sx={{ display: "flex", alignItems: "baseline" }} >
          <EditIcon sx={{ mx: 1 }} fontSize="xl2" />
          <Typography level="h4">
            {`Editing Question ${question.id}`}</Typography>
        </Box>
      </AppLayout.Header>
      <Grid container sx={{ flex: 1, overflow: "hidden" }}>
        <Grid xs={6} lg={4}>
          <Box sx={{ p: 1 }}>
            <FormControl>
              <FormLabel>Learning Objectives</FormLabel>
              <LearningObjectivesAutoComplete
                value={editedQuestion.learningObjectives}
                onChange={updateLearningObjectives}
              />
            </FormControl>
            <FormControl sx={{ my: 1 }}>
              <FormLabel>Explanation</FormLabel>
              <Textarea 
                minRows={5}
                value={editedQuestion.explanation}
                onChange={() => {}} 
              />
            </FormControl>
            <FormControl sx={{ mt: 1, mb: 1 }}>
              <Select
                value={newVariantType}
                onChange={(_, v) => v && setNewVariantType(v)}
              >
                <Option value="simple">Simple</Option>
                <Option value="one-two">OneTwo</Option>
                <Option value="calculation">Calculation</Option>
              </Select>
            </FormControl>
            <IconButton
              variant="plain"
              color="success"
              sx={{ my: 1 }}
              onClick={createNewVariant}
              children={<AddIcon />}
            />
          </Box>
        </Grid>
        <Grid xs={6} lg={8} sx={{ height: "100%" }}>
          <List
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              overflow: "scroll"
            }}
          >
            {Object.values(editedQuestion.variants).map((result) => {
              const ref = createRef<HTMLLIElement>();
              return (
              <Draggable
                nodeRef={ref}
                key={result.id}
                position={{ x: 0, y: 0 }}
                onStop={(_, data) => {
                  setTimeout(() => {
                    const target = data.node.parentNode
                      ?.querySelectorAll(":hover")?.[0]
                      ?.getAttribute("data-variant-id");
                    if (!target) return;
                    mergeVariant(result.id, target);
                  }, 10);
                }}
              >
                <Box
                   ref={ref}
                  component="li"
                  data-variant-id={result.id}
                  sx={{
                    px: { xs: 0, md: 1 },
                    py: 1,
                    width: { xs: 1, lg: 1 / 2 },
                    "&.react-draggable-dragging": {
                      zIndex: 1000,
                    },
                    "&.react-draggable-dragging > *": {
                      zIndex: 1000,
                    },
                    "&:hover:not(.react-draggable-dragging)": {},
                  }}
                >
                  <QuestionVariantPreview
                    id={question.id}
                    variantId={result.id}
                    text={getQuestionPreview(question, result.id)}
                    learningObjectives={question.learningObjectives}
                    externalIds={result.externalIds}
                    topRightCorner={
                      <>
                        <Button
                          variant="plain"
                          sx={{ mr: 1 }}
                          onClick={() => setOpenVariant(result.id)}
                          children="Edit"
                        />
                        <Button
                          variant="plain"
                          color="danger"
                          onClick={() => deleteVariant(result.id)}
                          children="Delete"
                        />
                      </>
                    }
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                    }}
                  />
                </Box>
              </Draggable>
              )
            })}
          </List>
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
