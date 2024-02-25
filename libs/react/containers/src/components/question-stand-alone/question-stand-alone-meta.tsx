"use client";

import { useEffect, useState } from "react";
import { default as RefreshIcon } from "@mui/icons-material/Refresh";
import { Button, Divider, Link, Sheet, Stack, StackProps, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { getRandomId } from "@cf/base/utils";
import { ImageViewer, QuestionMultipleChoice, SearchList, useDisclose } from "@cf/react/components";
import type {
  QuestionBankName,
  QuestionTemplateId,
} from "@cf/core/question-bank";
import type {
  DrawingPoints,
  QuestionMultipleChoiceStatus as Status,
} from "@cf/react/components";
import type { FunctionComponent, ReactNode } from "react";
import { LearningObjectiveSearchResult } from "@cf/core/search";
import { SearchLearningObjectivesList } from "../search-learning-objectives";
import { SearchAnnexesList } from "../search-annexes/search-annexes-list";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

export type QuestionStandAloneClientProps = {
  preview: ReactNode;
  explanation: ReactNode;
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
  learningObjectives: LearningObjectiveSearchResult[];
  sx?: StackProps["sx"];
  component?: StackProps["component"];
};

const QuestionTab: FunctionComponent<Pick<
  QuestionStandAloneClientProps,
  "question" | "correctOptionId" | "options" | "annexes" | "seed"
>> = ({
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

export const QuestionStandAloneClient: FunctionComponent<
  QuestionStandAloneClientProps
> = ({ sx, component = "div", seed, learningObjectives, question, questionId, correctOptionId, options, annexes, preview, explanation }) => {
  return (
    <Tabs
      component={component}
      defaultValue="question"
      variant="outlined"
      sx={{
        borderRadius: 8,
        ...sx
      }}
    >
      <TabList >
        <Typography
          level="body-lg"
          component={"h2"}
          sx={{ display: "flex", alignItems: "center", pl: { xs: 1, sm: 2 } }}
          children={questionId}
        />
        <Tab
          sx={{ ml: "auto" }}
          value="question"
          children={"Question"}
        />
        <Tab
          value="explanation"
          children={"Explanation"}
        />
        <Tab
          value="meta"
          children={"Meta"}
          sx={{ borderTopRightRadius: 8 }}
        />
      </TabList>

      <TabPanel value="question" sx={{ p: { xs: 1, sm: 2 } }} >
        <QuestionTab
          question={question}
          correctOptionId={correctOptionId}
          options={options}
          annexes={annexes}
          seed={seed}
        />
      </TabPanel>

      <TabPanel value="explanation" sx={{ p: 0 }}>
        <Stack
          sx={{
            px: { xs: 1, sm: 2 },
            pb: 1,
            background: (t) => t.palette.background.level1,
          }}
        >
          {preview}
        </Stack>
        <Divider sx={{ mb: 1 }} />
        <Stack minHeight={300} sx={{ px: { xs: 1, sm: 2 } }}>
          {explanation}
        </Stack>
      </TabPanel>

      <TabPanel value="meta" sx={{ p: 0 }}>
        <Stack
          sx={{
            px: { xs: 1, sm: 2 },
            pb: 1,
            backgroundColor: "background.level1",
          }}
        >
          {preview}
        </Stack>
        <Divider sx={{ mb: 1 }} />
        <Stack minHeight={300} sx={{ px: { xs: 1, sm: 2 } }}>
          <Typography level="h3">
            Learning Objectives
          </Typography>
          <SearchLearningObjectivesList
            variant="plain"
            currentCourse="all"
            items={learningObjectives}
          />
          <Typography level="h3">
            Annexes
          </Typography>
          <SearchAnnexesList
            items={[]}
            noDataMessage="No related questions"
          />
          <Typography level="h3" sx={{ mt: 2 }}>
            External References
          </Typography>
          <SearchList
            items={[]}
            noDataMessage="No External References"
          />
        </Stack>

      </TabPanel>
    </Tabs>
  );
};
