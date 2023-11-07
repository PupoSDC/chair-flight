import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { default as RefreshIcon } from "@mui/icons-material/Refresh";
import { Button, Divider, styled } from "@mui/joy";
import {
  getQuestion,
  getQuestionPreview,
  getRandomId,
  getRandomShuffler,
} from "@chair-flight/core/app";
import {
  ImageViewer,
  MarkdownClient,
  QuestionBoxReview,
  QuestionMultipleChoice,
} from "@chair-flight/react/components";
import type { QuestionTemplateId } from "@chair-flight/base/types";
import type {
  DrawingPoints,
  QuestionBoxReviewProps,
  QuestionBoxReviewRef,
  QuestionMultipleChoiceStatus as Status,
} from "@chair-flight/react/components";
import type { trpc } from "@chair-flight/trpc/client";
import type { FunctionComponent } from "react";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

const Fab = styled(Button)`
  width: ${({ theme }) => theme.spacing(5)};
  height: ${({ theme }) => theme.spacing(5)};
  border-radius: 50%;
  position: absolute;
  bottom: ${({ theme }) => theme.spacing(2)};
  right: ${({ theme }) => theme.spacing(2)};
`;

const shuffle = getRandomShuffler("123");

export type QuestionReviewProps = {
  questionId: QuestionTemplateId;
  variantId?: string;
  seed?: string;
  onQuestionChanged?: (args: { variantId: string; seed: string }) => void;
  getQuestion:
    | typeof trpc.questionBank737.getQuestion
    | typeof trpc.questionBankAtpl.getQuestion;
} & Pick<QuestionBoxReviewProps, "sx" | "className" | "style" | "component">;

/**
 * Self contained component to review a question.
 * Component can be left uncontrolled, but the seed and variantId if supplied
 * make the component controlled.
 *
 * Uses TRPC to fetch the question data. Data is immutable
 */
export const QuestionOverview: FunctionComponent<QuestionReviewProps> = ({
  questionId,
  variantId: initialVariantId,
  seed: initialSeed,
  onQuestionChanged,
  getQuestion: { useSuspenseQuery: useQuestion },
  ...props
}) => {
  const localTabRef = useRef<QuestionBoxReviewRef>(null);
  const [questionData] = useQuestion({ questionId });
  const [seed, setSeed] = useState<string>(initialSeed ?? getRandomId());
  const [variantId, setVariantId] = useState(initialVariantId);
  const [selectedOption, setSelectedOption] = useState<string>();
  const [currentAnnex, setCurrentAnnex] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<Status>("in-progress");
  const [annexDrawings, setAnnexDrawings] = useState<DrawingPointsMap>({});

  const questionTemplate = questionData.questionTemplate;
  const allVariantsMap = questionData.questionTemplate.variants;
  const learningObjectives = questionData.learningObjectives;
  const allVariantsArray = Object.values(allVariantsMap);
  const variant = allVariantsMap[variantId ?? ""] ?? allVariantsArray[0];

  const question = useMemo(
    () => getQuestion(questionTemplate, { variantId, seed }),
    [variantId, questionTemplate, seed],
  );

  const randomizedOptions = useMemo(
    () => getRandomShuffler(seed ?? "")(question.options),
    [question, seed],
  );

  const navigateToVariant = (variantId: string, seed: string) => {
    setSelectedOption(undefined);
    setVariantId(variantId);
    localTabRef.current?.change?.("question");
    setSelectedStatus("in-progress");
    setSeed(seed);
    onQuestionChanged?.({ seed, variantId });
  };

  useEffect(() => {
    if (initialSeed) setSeed(initialSeed);
    if (initialVariantId) setVariantId(initialVariantId);
  }, [initialSeed, initialVariantId]);

  const questionTab = (
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
            [currentAnnex ?? ""]: (old[currentAnnex ?? ""] ?? []).slice(0, -1),
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
      <Fab
        children={<RefreshIcon />}
        onClick={() =>
          navigateToVariant(shuffle(allVariantsArray)[0].id, getRandomId())
        }
      />
    </>
  );

  const previewTab = (
    <>
      {allVariantsArray.map(({ id }) => {
        const preview = getQuestionPreview(questionTemplate, id);
        return (
          <Fragment key={id}>
            <MarkdownClient children={preview} />
            <Button
              sx={{ mb: 2, mx: "auto" }}
              children="Generate This Variant"
              variant="outlined"
              onClick={() => navigateToVariant(id, getRandomId())}
            />
            <Divider />
          </Fragment>
        );
      })}
    </>
  );

  return (
    <QuestionBoxReview
      ref={localTabRef}
      explanation={question.explanation}
      question={questionTab}
      preview={previewTab}
      learningObjectives={learningObjectives}
      externalReferences={variant?.externalIds
        .map((id) => ({ name: id, href: "" }))
        .sort((a, b) => a.name.localeCompare(b.name))}
      {...props}
    />
  );
};
