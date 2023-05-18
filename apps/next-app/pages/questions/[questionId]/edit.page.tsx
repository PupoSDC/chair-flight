import { useEffect, useId, useRef, useState } from "react";
import { default as Draggable } from "react-draggable";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
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
  Typography,
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
import { AppHead } from "@chair-flight/next/client";
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
  const hasPushedInitialHistory = useRef(false);
  const dispatch = useAppDispatch();
  const questionEditorEntry = useAppSelector(
    (state) => state.questionEditor.questions[question.id]
  );

  const editedQuestion = questionEditorEntry?.history?.at(-1) ?? question;

  useEffect(() => {
    if (hasPushedInitialHistory.current) return;
    dispatch(actions.updateQuestionTemplate({ question }));
    hasPushedInitialHistory.current = true;
  });

  const mergeVariant = (fromVariantId: string, toVariantId: string) => {
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

  return (
    <List
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        overflow: "scroll",
      }}
    >
      {Object.values(editedQuestion.variants).map((result) => (
        <Draggable
          key={result.id}
          position={{ x: 0, y: 0 }}
          onStop={(e, data) => {
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
            component="li"
            data-variant-id={result.id}
            sx={{
              px: { xs: 0, md: 1 },
              py: 1,
              width: { xs: 1, md: 1 / 2, lg: 1 / 3 },
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
                <Button
                  variant="plain"
                  //onClick={() => setOpenVariant(result.id)}
                  children="Edit"
                />
              }
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            />
          </Box>
        </Draggable>
      ))}
    </List>
  );
};

export const QuestionPage: NextPage<QuestionPageProps> = ({ question }) => {
  return (
    <>
      <AppHead title={question.id} />
      <Header />
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
