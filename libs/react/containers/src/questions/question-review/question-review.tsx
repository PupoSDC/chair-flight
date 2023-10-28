import {
  Fragment,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { mergeRefs } from "react-merge-refs";
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
import { trpc } from "@chair-flight/trpc/client";
import type { QuestionTemplateId } from "@chair-flight/base/types";
import type {
  DrawingPoints,
  QuestionBoxReviewProps,
  QuestionBoxReviewRef,
  QuestionMultipleChoiceStatus,
} from "@chair-flight/react/components";

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
  questionBank?: "questionBankAtpl" | "questionBank737";
  title?: string;
  variantId?: string;
  seed?: string;
  onQuestionChanged?: (args: { variantId: string; seed: string }) => void;
} & Pick<QuestionBoxReviewProps, "sx" | "className" | "style" | "component">;

/**
 * Self contained component to review a question.
 * Component can be left uncontrolled, but the seed and variantId if supplied
 * make the component controlled.
 *
 * Uses TRPC to fetch the question data. Data is immutable
 */
export const QuestionReview = forwardRef<
  QuestionBoxReviewRef,
  QuestionReviewProps
>(
  (
    {
      title,
      questionBank = "questionBankAtpl",
      questionId,
      variantId: initialVariantId,
      seed: initialSeed,
      onQuestionChanged,
      ...props
    },
    ref,
  ) => {
    const localTabRef = useRef<QuestionBoxReviewRef>();
    const [seed, setSeed] = useState<string>(initialSeed ?? getRandomId());
    const [variantId, setVariantId] = useState(initialVariantId);
    const [selectedOption, setSelectedOption] = useState<string>();
    const [currentAnnex, setCurrentAnnex] = useState<string>();
    const [selectedStatus, setSelectedStatus] =
      useState<QuestionMultipleChoiceStatus>("in-progress");
    const [annexDrawings, setAnnexDrawings] = useState<
      Record<string, DrawingPoints[]>
    >({});
    const procedure = trpc[questionBank]
      .getQuestion as (typeof trpc)["questionBankAtpl"]["getQuestion"];
    const { data, isLoading } = procedure.useQuery({ questionId });

    const question = useMemo(
      () =>
        data ? getQuestion(data?.questionTemplate, { variantId, seed }) : null,
      [variantId, data, seed],
    );

    const randomizedOptions = useMemo(
      () => (question ? getRandomShuffler(seed ?? "")(question.options) : []),
      [question, seed],
    );

    const allVariantsMap = data?.questionTemplate?.variants ?? {};
    const allVariantsArray = Object.values(allVariantsMap);
    const variant = allVariantsMap[variantId ?? ""] ?? allVariantsArray[0];
    const learningObjectives = data?.learningObjectives ?? [];

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

    const questionTab = question ? (
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
              [currentAnnex ?? ""]: (old[currentAnnex ?? ""] ?? []).slice(
                0,
                -1,
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
        <Fab
          children={<RefreshIcon />}
          onClick={() =>
            navigateToVariant(shuffle(allVariantsArray)[0].id, getRandomId())
          }
        />
      </>
    ) : undefined;

    const previewTab = data ? (
      <>
        {allVariantsArray.map(({ id }) => {
          const preview = getQuestionPreview(data.questionTemplate, id);
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
    ) : undefined;

    return (
      <QuestionBoxReview
        ref={mergeRefs([localTabRef, ref])}
        loading={isLoading}
        explanation={question?.explanation}
        question={questionTab}
        preview={previewTab}
        learningObjectives={learningObjectives.map((lo) => ({
          id: lo.id,
          text: lo.text,
          href: "/learning-objectives/[learningObjectiveId]",
        }))}
        externalReferences={variant?.externalIds
          .map((id) => ({ name: id, href: "" }))
          .sort((a, b) => a.name.localeCompare(b.name))}
        {...props}
      />
    );
  },
);
