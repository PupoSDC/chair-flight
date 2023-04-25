import { useId, useState } from "react";
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
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  getQuestionPreview,
  getRandomIdGenerator,
  questionSchema,
} from "@chair-flight/core/app";
import { AppHead } from "@chair-flight/next/components";
import { getQuestionFromLocalFs } from "@chair-flight/next/server";
import {
  Header,
  AppLayout,
  QuestionVariantPreview,
  toast,
} from "@chair-flight/react/components";
import { AutoExpandTextArea } from "./components/AutoExpandTextArea";
import { FormSnippetEditVariant } from "./components/FormSnippetEditVariant";
import { LearningObjectivesAutoComplete } from "./components/LearningObjectivesAutoComplete";
import type { putBodySchema } from "../api/questions/[questionId].api";
import type { GetServerSideProps, NextPage } from "next";
import type {
  QuestionTemplate,
  QuestionVariant,
  QuestionVariantType,
} from "@chair-flight/base/types";

type QuestionPageProps = {
  question: QuestionTemplate;
};

const QuestionPage: NextPage<QuestionPageProps> = ({ question }) => {
  const randomSeed = useId();
  const defaultValues = question;

  const resolver = zodResolver(questionSchema);

  const [getRandomId] = useState(() => getRandomIdGenerator(randomSeed));
  const [openVariant, setOpenVariant] = useState<string>();
  const [newVariantType, setNewVariantType] =
    useState<QuestionVariantType>("simple");

  const form = useForm({ resolver, defaultValues });
  const { register, handleSubmit, control, watch, setValue } = form;

  const variantsMap = watch("variants");
  const variants = Object.values(variantsMap).sort((a, b) =>
    a.id.localeCompare(b.id)
  );

  const createNewVariant = () => {
    const common = {
      id: getRandomId(),
      type: newVariantType,
      question: "",
      annexes: [] as string[],
      externalIds: [] as string[],
      explanation: "",
    };
    if (newVariantType === "simple") {
      setValue(`variants.${common.id}`, {
        ...common,
        type: "simple",
        options: [1, 2, 3, 4].map((i) => ({
          id: getRandomId(),
          text: "",
          correct: i === 1,
          why: "",
        })),
      });
      return;
    }
    if (newVariantType === "one-two") {
      setValue(`variants.${common.id}`, {
        ...common,
        type: "one-two",
        firstCorrectStatements: [""],
        secondCorrectStatements: [""],
        firstIncorrectStatements: [""],
        secondIncorrectStatements: [""],
      });
      return;
    }
  };

  const deleteVariant = (variant: QuestionVariant) => {
    setValue(
      "variants",
      variants
        .filter((v) => v.id !== variant.id)
        .reduce((acc, v) => ({ ...acc, [v.id]: v }), {})
    );
  };

  return (
    <>
      <AppHead title={question.id} />
      <Header />
      <AppLayout.Main>
        <AppLayout.Grid
          component="form"
          onSubmit={handleSubmit(async (question) => {
            const promise = axios.put<void, void, putBodySchema>(
              `/api/questions/${question.id}`,
              { question }
            );
            toast.promise(promise, {
              loading: "Saving...",
              success: "Saved",
              error: "Error!",
            });
          })}
        >
          <AppLayout.Column xs={8}>
            <FormProvider {...form}>
              <AppLayout.Header>
                <Typography level="h2">{question.id}</Typography>
                <IconButton
                  color="success"
                  variant="plain"
                  type="submit"
                  children={<SaveIcon />}
                />
              </AppLayout.Header>
              <AppLayout.ScrollableContainer>
                <FormControl sx={{ my: 1 }}>
                  <FormLabel>Learning Objectives (Common)</FormLabel>
                  <Controller
                    name={`learningObjectives`}
                    control={control}
                    render={({ field }) => (
                      <LearningObjectivesAutoComplete {...field} />
                    )}
                  />
                </FormControl>
                <FormControl sx={{ my: 1 }}>
                  <FormLabel>Explanation</FormLabel>
                  <AutoExpandTextArea {...register("explanation")} />
                </FormControl>
                <AppLayout.Header>
                  <Typography level="h3">Variants</Typography>
                  <Box sx={{ flexGrow: 1 }} />
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
                </AppLayout.Header>
                <List>
                  {variants.map((variant) => (
                    <Sheet
                      component="li"
                      key={variant.id}
                      variant="outlined"
                      sx={{ p: 2, my: 1 }}
                    >
                      <AppLayout.Header>
                        <IconButton
                          variant="plain"
                          size="sm"
                          color="neutral"
                          sx={{ mr: 1 }}
                          children={
                            openVariant === variant.id ? (
                              <KeyboardArrowDown />
                            ) : (
                              <KeyboardArrowRight />
                            )
                          }
                          onClick={() =>
                            setOpenVariant((oldId) =>
                              variant.id === oldId ? undefined : variant.id
                            )
                          }
                        />
                        <Typography level="h5">
                          {`${variant.id} - ${variant.type}`}
                        </Typography>
                        <Box sx={{ flex: 1 }} />
                        <IconButton
                          variant="plain"
                          color="danger"
                          onClick={() => deleteVariant(variant)}
                          children={<CloseIcon />}
                        />
                      </AppLayout.Header>
                      {openVariant === variant.id && (
                        <FormSnippetEditVariant variantId={variant.id} />
                      )}
                    </Sheet>
                  ))}
                </List>
              </AppLayout.ScrollableContainer>
            </FormProvider>
          </AppLayout.Column>
          <AppLayout.Column xs={4}>
            <AppLayout.Header>
              <Typography level="h3">Variants</Typography>
            </AppLayout.Header>
            <AppLayout.ScrollableContainer component="ul">
              {variants.map(({ id: variantId }) => (
                <Box component="li" sx={{ py: 1 }} key={variantId}>
                  <QuestionVariantPreview
                    id={question.id}
                    variantId={variantId}
                    text={getQuestionPreview(watch(), variantId)}
                    learningObjectives={question.learningObjectives}
                    externalIds={watch(`variants.${variantId}.externalIds`)}
                    topRightCorner={
                      <Button
                        variant="plain"
                        onClick={() => setOpenVariant(variantId)}
                      >
                        {openVariant === variantId ? (
                          <RadioButtonCheckedIcon color="primary" />
                        ) : (
                          <RadioButtonUncheckedIcon color="primary" />
                        )}
                      </Button>
                    }
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                    }}
                  />
                </Box>
              ))}
            </AppLayout.ScrollableContainer>
          </AppLayout.Column>
        </AppLayout.Grid>
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  QuestionPageProps
> = async ({ params }) => {
  const question = await getQuestionFromLocalFs(
    params?.["questionId"] as string
  );

  if (!question) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      question,
    },
  };
};

export default QuestionPage;
