import { useEffect, useState } from "react";
import { tabPanelClasses } from "@mui/base";
import { default as OpenInNewIcon } from "@mui/icons-material/OpenInNew";
import { default as RefreshIcon } from "@mui/icons-material/Refresh";
import {
  Button,
  CircularProgress,
  Divider,
  Link,
  List,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
  dividerClasses,
  tabClasses,
  tabListClasses,
} from "@mui/joy";
import { getRandomId } from "@chair-flight/base/utils";
import {
  ImageViewer,
  LearningObjectiveList,
  MarkdownClient,
  QuestionList,
  QuestionMultipleChoice,
  Ups,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import type {
  QuestionBankName,
  QuestionTemplateId,
} from "@chair-flight/core/question-bank";
import type {
  DrawingPoints,
  QuestionMultipleChoiceStatus as Status,
} from "@chair-flight/react/components";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

type TabName = "question" | "explanation" | "meta" | "variants";

type Props = {
  questionBank: QuestionBankName;
  questionId: QuestionTemplateId;
  seed?: string;
  onQuestionChanged?: (args: { seed: string }) => void;
};

type Params = {
  questionBank: QuestionBankName;
  questionId: QuestionTemplateId;
  seed: string;
};

type Data = AppRouterOutput["containers"]["questions"]["getQuestionOverview"];

export const QuestionOverview = container<Props, Params, Data>(
  ({
    questionId,
    questionBank,
    seed: initialSeed,
    onQuestionChanged,
    sx,
    component = "section",
  }) => {
    const [tab, setTab] = useState<TabName>("question");
    const [seed, setSeed] = useState<string>(initialSeed ?? getRandomId());
    const [selectedOption, setSelectedOption] = useState<string>();
    const [currentAnnex, setCurrentAnnex] = useState<string>();
    const [selectedStatus, setSelectedStatus] = useState<Status>("in-progress");
    const [annexDrawings, setAnnexDrawings] = useState<DrawingPointsMap>({});
    const {
      question,
      annexes,
      relatedQuestions,
      learningObjectives,
      externalIds,
      editLink,
    } = QuestionOverview.useData({
      questionBank,
      questionId,
      seed,
    });

    const showExplanation = !!question.explanation;
    const dividerWidth = "sm" as const;

    const navigateToNewSeed = (seed: string) => {
      setSelectedOption(undefined);
      setTab("question");
      setSelectedStatus("in-progress");
      setSeed(seed);
      onQuestionChanged?.({ seed });
    };

    useEffect(() => {
      if (initialSeed) setSeed(initialSeed);
    }, [initialSeed]);

    return (
      <Tabs
        component={component}
        value={tab}
        onChange={(_, v) => setTab(v as TabName)}
        sx={{
          position: "relative",
          backgroundColor: "initial",

          [`& .${tabClasses.root}`]: {
            backgroundColor: "transparent",
            flex: "initial",
            height: (t) => t.spacing(5),
            border: "none",
            fontWeight: 500,

            "&:hover": {
              backgroundColor: "transparent",
            },

            [`&.${tabClasses.selected}`]: {
              color: "primary.plainColor",
              backgroundColor: "initial",
              "&::after": {
                height: 2,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                bgcolor: "primary.500",
              },
            },
          },

          [`& .${tabListClasses.root}`]: {
            justifyContent: "center",
            width: "100%",
            maxWidth: dividerWidth,
            margin: "auto",
          },

          [`& .${tabPanelClasses.root}`]: {
            backgroundColor: "initial",
            width: "100%",
            margin: "auto",
          },

          [`& .${dividerClasses.root}`]: {
            maxWidth: dividerWidth,
            margin: "auto",
            my: 2,
          },

          ...sx,
        }}
      >
        <TabList>
          <Tab indicatorInset value={"question"}>
            Question
          </Tab>
          <Tab indicatorInset value={"explanation"}>
            Explanation
          </Tab>
          <Tab value={"meta"}>Meta</Tab>
          <Tab href={editLink} component={Link} value="edit">
            Edit
          </Tab>
        </TabList>
        <TabPanel value={"question"}>
          <QuestionMultipleChoice
            sx={{ p: 0, maxWidth: "md", margin: "auto" }}
            question={question.question}
            correctOptionId={question.correctOptionId}
            selectedOptionId={selectedOption}
            status={selectedStatus}
            disabled={selectedStatus === "show-result"}
            options={question.options}
            annexes={annexes}
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
          <Button
            children={<RefreshIcon />}
            onClick={() => navigateToNewSeed(getRandomId())}
            sx={{
              width: (theme) => theme.spacing(5),
              height: (theme) => theme.spacing(5),
              borderRadius: "50%",
              position: "absolute",
              bottom: (theme) => theme.spacing(2),
              right: (theme) => theme.spacing(2),
            }}
          />
          <Divider />
        </TabPanel>
        <TabPanel value={"explanation"} sx={{ maxWidth: "lg" }}>
          {showExplanation ? (
            <MarkdownClient>{question.explanation}</MarkdownClient>
          ) : (
            <Ups message="No explanation to this question is available" />
          )}
          <Divider />
        </TabPanel>
        <TabPanel value={"meta"} sx={{ maxWidth: "lg" }}>
          <Typography level="h4" sx={{ mt: 2 }}>
            Learning Objectives
          </Typography>
          <LearningObjectiveList items={learningObjectives} />
          <Typography level="h4" sx={{ mt: 2 }}>
            Related Questions
          </Typography>
          <QuestionList items={relatedQuestions} />

          <Typography level="h4">External References</Typography>
          <Divider />
          <List aria-label="basic-list">
            {externalIds
              .sort((a, b) => a.localeCompare(b))
              .map((ref) => (
                <ListItem key={ref}>
                  <Link href={""} disabled>
                    <span>{ref}</span>
                    <OpenInNewIcon sx={{ ml: 1 }} />
                  </Link>
                </ListItem>
              ))}
          </List>
          <Divider />
        </TabPanel>
        <TabPanel value={"variants"} sx={{ maxWidth: "lg" }}>
          <Divider />
        </TabPanel>
        <TabPanel value={"edit"} sx={{ maxWidth: "lg" }}>
          <CircularProgress
            sx={{ mx: "auto", display: "flex", my: 4 }}
            size="lg"
          />
        </TabPanel>
      </Tabs>
    );
  },
);

QuestionOverview.displayName = "QuestionOverview";

QuestionOverview.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  const questionId = getRequiredParam(params, "questionId");
  const seed = getRequiredParam(params, "seed");
  return await router.getQuestionOverview.fetch({
    questionBank,
    questionId,
    seed,
  });
};

QuestionOverview.useData = (params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  const questionId = getRequiredParam(params, "questionId");
  const seed = getRequiredParam(params, "seed");
  return router.getQuestionOverview.useSuspenseQuery({
    questionBank,
    questionId,
    seed,
  })[0];
};
