"use client";

import { useEffect, useState } from "react";
import { default as RefreshIcon } from "@mui/icons-material/Refresh";
import { Button, Link, Stack, StackProps } from "@mui/joy";
import { getRandomId } from "@cf/base/utils";
import { ImageViewer, QuestionMultipleChoice } from "@cf/react/components";
import type {
  QuestionBankName,
  QuestionTemplateId,
} from "@cf/core/question-bank";
import type {
  DrawingPoints,
  QuestionMultipleChoiceStatus as Status,
} from "@cf/react/components";
import type { FunctionComponent, ReactNode } from "react";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

export type QuestionStandAloneClientProps = {
  question: ReactNode;
  correctOptionId: string;
  options: Array<{
    id: string;
    text: ReactNode;
    why: string;
  }>;
  annexes: { id: string; href: string }[];
  questionBank: QuestionBankName;
  questionId: QuestionTemplateId;
  seed: string;
  sx?: StackProps["sx"];
  component?: StackProps["component"];
};

export const QuestionStandAloneClient: FunctionComponent<
  QuestionStandAloneClientProps
> = ({ sx, component = "div", seed, question, correctOptionId, options, annexes }) => {
  const [selectedOption, setSelectedOption] = useState<string>();
  const [currentAnnex, setCurrentAnnex] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<Status>("in-progress");
  const [annexDrawings, setAnnexDrawings] = useState<DrawingPointsMap>({});

  useEffect(() => {
    setSelectedOption(undefined);
    setSelectedStatus("in-progress");
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
      <Button
        children={<RefreshIcon />}
        component={Link}
        href={"?seed=" + getRandomId()}
        sx={{
          borderRadius: "50%",
          position: "absolute",
          width: (theme) => theme.spacing(5),
          height: (theme) => theme.spacing(5),
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
      />
    </Stack>
  );
};
