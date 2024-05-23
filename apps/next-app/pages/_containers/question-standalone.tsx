import { useEffect, useRef, useState } from "react";
import { NoSsr } from "@mui/base";
import { Stack } from "@mui/joy";
import { ImageViewer, QuestionMultipleChoice } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";
import type {
  DrawingPoints,
  QuestionMultipleChoiceStatus,
} from "@cf/react/web";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

type Status = QuestionMultipleChoiceStatus;
type DrawingPointsMap = Record<string, DrawingPoints[]>;

export const QuestionStandalone: FunctionComponent<
  {
    questionId: string;
    seed: string;
  } & StackProps
> = ({ questionId, seed, ...props }) => {
  const questionQuery = trpc.questionBank.questions.getStandalone.useQuery(
    { id: questionId, seed },
    { keepPreviousData: true },
  );

  const [selectedOption, setSelectedOption] = useState<string>();
  const [questionStatus, setQuestionStatus] = useState<Status>("in-progress");
  const [currentAnnex, setCurrentAnnex] = useState<string>();
  const [annexDrawings, setAnnexDrawings] = useState<DrawingPointsMap>({});

  const oldParams = useRef({ questionId, seed });

  useEffect(() => {
    const old = oldParams.current;
    if (old.questionId === questionId && old.seed === seed) return;
    oldParams.current = { questionId, seed };
    setSelectedOption(undefined);
    setQuestionStatus("in-progress");
    setCurrentAnnex(undefined);
    setAnnexDrawings({});
  });

  return (
    <Stack {...props}>
      <QuestionMultipleChoice
        loading={questionQuery.isLoading}
        question={questionQuery.data?.question.question}
        options={questionQuery.data?.question.options}
        correctOptionId={questionQuery.data?.question.correctOptionId}
        selectedOptionId={selectedOption}
        status={questionStatus}
        disabled={questionStatus === "show-result"}
        onAnnexClicked={setCurrentAnnex}
        annexesHref={questionQuery.data?.annexes.map((annex) => annex.href)}
        onOptionClicked={(optionId) => {
          setSelectedOption(optionId);
          setQuestionStatus("show-result");
        }}
      />
      <NoSsr>
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
      </NoSsr>
    </Stack>
  );
};
