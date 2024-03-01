"use client";

import { useEffect, useState } from "react";
import { Stack } from "@mui/joy";
import { ImageViewer, QuestionMultipleChoice } from "@cf/react/ui";
import type { TestQuestion } from "@cf/core/tests";
import type {
  DrawingPoints,
  QuestionMultipleChoiceStatus as Status,
  QuestionMultipleChoiceProps,
} from "@cf/react/ui";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

export type QuestionStandAloneClientProps = Pick<
  StackProps,
  "sx" | "component"
> &
  Pick<
    QuestionMultipleChoiceProps,
    "question" | "correctOptionId" | "options"
  > &
  Pick<TestQuestion, "annexes" | "seed">;

export const QuestionStandAloneClient: FunctionComponent<
  QuestionStandAloneClientProps
> = ({
  sx,
  component = "div",
  question,
  options,
  correctOptionId,
  annexes,
  seed,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>();
  const [currentAnnex, setCurrentAnnex] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<Status>("in-progress");
  const [annexDrawings, setAnnexDrawings] = useState<DrawingPointsMap>({});

  useEffect(() => {
    setSelectedOption(undefined);
    setSelectedStatus("in-progress");
    setCurrentAnnex(undefined);
    setAnnexDrawings({});
  }, [seed]);

  return (
    <Stack component={component} sx={{ display: "relative", ...sx }}>
      <QuestionMultipleChoice
        sx={{ width: "100%" }}
        question={question}
        correctOptionId={correctOptionId}
        selectedOptionId={selectedOption}
        status={selectedStatus}
        disabled={selectedStatus === "show-result"}
        options={options}
        annexesHref={annexes}
        onOptionClicked={(optionId) => {
          setSelectedOption(optionId);
          setSelectedStatus("show-result");
        }}
        onAnnexClicked={(annex) => {
          setCurrentAnnex(annex);
        }}
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
    </Stack>
  );
};
