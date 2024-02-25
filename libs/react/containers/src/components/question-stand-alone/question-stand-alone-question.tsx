"use client";

import { useEffect, useState } from "react";
import { ImageViewer, QuestionMultipleChoice } from "@cf/react/components";
import type {
  DrawingPoints,
  QuestionMultipleChoiceProps,
  QuestionMultipleChoiceStatus as Status,
} from "@cf/react/components";
import type { FunctionComponent, ReactNode } from "react";
import { AnnexSearchResult } from "@cf/core/search";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

export type QuestionStandAloneQuestionProps = {
  question: ReactNode;
  seed: string;
  correctOptionId: string;
  annexes: Array<{ id: string; href: string }>;
  options: QuestionMultipleChoiceProps["options"];
};

export const QuestionStandAloneQuestion: FunctionComponent<
  QuestionStandAloneQuestionProps
> = ({
  question,
  correctOptionId,
  options,
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
    }, [seed]);

    return (
      <>
        <QuestionMultipleChoice
          sx={{ width: "100%" }}
          question={question}
          correctOptionId={correctOptionId}
          selectedOptionId={selectedOption}
          status={selectedStatus}
          disabled={selectedStatus === "show-result"}
          options={options}
          annexesHref={annexes.map((annex) => annex.href)}
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
      </>
    )
  }
