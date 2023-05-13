import { useMemo, useRef, useState } from "react";
import React from "react";
import { useRouter } from "next/router";
import { default as RadioButtonCheckedIcon } from "@mui/icons-material/RadioButtonChecked";
import { default as RadioButtonUncheckedIcon } from "@mui/icons-material/RadioButtonUnchecked";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Button, Divider, styled } from "@mui/joy";
import {
  getQuestion,
  getQuestionPreview,
  getRandomId,
  getRandomShuffler,
} from "@chair-flight/core/app";
import { AppHead, APP_NAME, AppHeaderMenu } from "@chair-flight/next/client";
import { ssrHandler } from "@chair-flight/next/server";
import {
  Header,
  AppLayout,
  QuestionBoxReview,
  QuestionMultipleChoice,
  MarkdownClient,
  QuestionVariantPreview,
  ImageViewer,
} from "@chair-flight/react/components";
import { getQuestionTemplate } from "../../api/questions/[questionId].api";
import type { GetQuestionTemplateResponse } from "../../api/questions/[questionId].api";
import type {
  QuestionMultipleChoiceStatus,
  QuestionBoxReviewRef,
  DrawingPoints,
} from "@chair-flight/react/components";
import type { NextPage } from "next";

type QuestionPageProps = GetQuestionTemplateResponse & {
  initialVariantId?: string;
  initialSeed?: string;
};

const shuffle = getRandomShuffler("123");

const QuestionPage: NextPage<QuestionPageProps> = ({
  questionTemplate,
  learningObjectives,
  initialVariantId,
  initialSeed,
}) => {
  const questionBoxRef = useRef<QuestionBoxReviewRef>(null);
  const { query, replace } = useRouter();
  const seed = (query["seed"] ?? initialSeed) as string;
  const variantId = (query["variantId"] ?? initialVariantId) as string;
  const allVariants = Object.values(questionTemplate.variants);
  const variant = questionTemplate.variants[variantId] ?? allVariants[0];
  const [currentAnnex, setCurrentAnnex] = useState<string>();
  const [selectedOption, setSelectedOption] = useState<string>();
  const [selectedStatus, setSelectedStatus] =
    useState<QuestionMultipleChoiceStatus>("in-progress");
  const [annexDrawings, setAnnexDrawings] = useState<
    Record<string, DrawingPoints[]>
  >({});

  const question = useMemo(
    () => getQuestion(questionTemplate, { variantId, seed }),
    [variantId, questionTemplate, seed]
  );

  const randomizedOptions = useMemo(
    () => getRandomShuffler(seed ?? "")(question.options),
    [question.options, seed]
  );

  const navigateToVariant = (variantId: string, seed: string) => {
    replace({ query: { ...query, variantId, seed } }, undefined, {
      shallow: true,
    });
    setSelectedOption(undefined);
    setSelectedStatus("in-progress");
    questionBoxRef.current?.change?.("question");
  };

  return (
    <>
      <AppHead
        linkTitle={`${APP_NAME}: ${variant.id}`}
        linkDescription={variant.question}
      />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main>
        <AppLayout.Grid>
          <AppLayout.Column xs={12} md={7} lg={8} xl={9}>
            <QuestionBoxReview
              ref={questionBoxRef}
              sx={{ flex: 1 }}
              explanation={question.explanation}
              question={
                <>
                  <QuestionMultipleChoice
                    sx={{ p: 0 }}
                    question={question.question}
                    correctOptionId={question.correctOptionId}
                    selectedOptionId={selectedOption}
                    status={selectedStatus}
                    disabled={selectedStatus === "show-result"}
                    options={randomizedOptions.map((option) => ({
                      optionId: option.id,
                      text: option.text,
                    }))}
                    onOptionClicked={(optionId) => {
                      setSelectedOption(optionId);
                      setSelectedStatus("show-result");
                    }}
                    annexes={question.annexes}
                    onAnnexClicked={(annex) => setCurrentAnnex(annex)}
                  />
                  <Fab
                    onClick={() => {
                      navigateToVariant(
                        shuffle(allVariants)[0].id,
                        getRandomId()
                      );
                      setSelectedOption(undefined);
                      setSelectedStatus("in-progress");
                    }}
                  />
                </>
              }
              preview={
                <>
                  {allVariants.map(({ id }) => {
                    const preview = getQuestionPreview(questionTemplate, id);
                    return (
                      <React.Fragment key={id}>
                        <MarkdownClient children={preview} />
                        <Button
                          sx={{ mb: 2, mx: "auto" }}
                          children="Generate This Variant"
                          variant="outlined"
                          onClick={() => navigateToVariant(id, getRandomId())}
                        />
                        <Divider />
                      </React.Fragment>
                    );
                  })}
                </>
              }
              externalReferences={variant.externalIds
                .map((id) => ({
                  name: id,
                  href: "",
                }))
                .sort((a, b) => a.name.localeCompare(b.name))}
              learningObjectives={learningObjectives.map((lo) => ({
                id: lo.id,
                text: lo.text,
                href: "/learning-objectives/[learningObjectiveId]",
              }))}
            />
            <ImageViewer
              open={currentAnnex !== undefined}
              onClose={() => setCurrentAnnex(undefined)}
              drawings={annexDrawings[currentAnnex ?? ""] ?? []}
              onDrawingsChanged={(newDrawings) =>
                setAnnexDrawings((oldDrawings) => ({
                  ...oldDrawings,
                  [currentAnnex ?? ""]: newDrawings,
                }))
              }
              onUndo={() =>
                setAnnexDrawings((old) => ({
                  ...old,
                  [currentAnnex ?? ""]: (old[currentAnnex ?? ""] ?? []).slice(
                    0,
                    -1
                  ),
                }))
              }
              onReset={() =>
                setAnnexDrawings((old) => ({
                  ...old,
                  [currentAnnex ?? ""]: [],
                }))
              }
              imgSrc={currentAnnex ?? ""}
            />
          </AppLayout.Column>
          <AppLayout.Column
            sx={{ display: { xs: "none", md: "block" } }}
            md={5}
            lg={4}
            xl={3}
          >
            <AppLayout.ScrollableContainer>
              {allVariants.map((otherVariant) => (
                <Box component="li" key={otherVariant.id} sx={{ pb: 1 }}>
                  <QuestionVariantPreview
                    component={Button}
                    id={otherVariant.id}
                    variantId={otherVariant.id}
                    text={getQuestionPreview(questionTemplate, otherVariant.id)}
                    learningObjectives={questionTemplate.learningObjectives}
                    externalIds={otherVariant.externalIds}
                    onClick={() =>
                      navigateToVariant(otherVariant.id, getRandomId())
                    }
                    topRightCorner={
                      variantId === otherVariant.id ? (
                        <RadioButtonCheckedIcon color="primary" />
                      ) : (
                        <RadioButtonUncheckedIcon color="primary" />
                      )
                    }
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

const Fab = styled(Button)`
  width: ${({ theme }) => theme.spacing(5)};
  height: ${({ theme }) => theme.spacing(5)};
  border-radius: 50%;
  position: fixed;
  bottom: ${({ theme }) => theme.spacing(2)};
  right: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up("md")} {
    position: absolute;
  }
`;

Fab.defaultProps = {
  children: <RefreshIcon />,
};

export const getServerSideProps = ssrHandler<QuestionPageProps>(
  async ({ context, questionBank }) => {
    const { questionTemplate, learningObjectives } = await getQuestionTemplate(
      context.params?.["questionId"] as string,
      questionBank
    );

    const initialVariantId =
      (context.query?.["variantId"] as string | undefined) ??
      shuffle(Object.values(questionTemplate.variants))[0].id;

    const initialSeed =
      (context.query?.["seed"] as string | undefined) ?? getRandomId();

    return {
      props: {
        questionTemplate,
        learningObjectives,
        initialVariantId,
        initialSeed,
      },
    };
  }
);

export default QuestionPage;
