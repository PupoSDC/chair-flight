import { forwardRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { tabPanelClasses } from "@mui/base";
import {
  Grid,
  ModalClose,
  ModalDialog,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
  tabClasses,
} from "@mui/joy";
import { getQuestionPreview } from "@chair-flight/core/question-bank";
import { MarkdownClientCompressed } from "@chair-flight/react/components";
import { QuestionStandAloneComponent } from "../../question-stand-alone/question-stand-alone";
import { QuestionEditorTabAnnexes } from "./question-editor-tab-annexes";
import { QuestionEditorTabExplanation } from "./question-editor-tab-explanation";
import { QuestionEditorTabLearningObjectives } from "./question-editor-tab-learning-objectives";
import { QuestionEditorTabRelatedQuestions } from "./question-editor-tab-related-questions";
import type { QuestionEditorState } from "../hooks/use-question-editor";

export type QuestionEditorDialogProps = {
  questionId: string;
};

export const QuestionEditorDialog = forwardRef<
  HTMLDivElement,
  QuestionEditorDialogProps
>(({ questionId }, ref) => {
  const [demoMode, setDemoMode] = useState(false);
  const [tab, setTab] = useState("question");
  const form = useFormContext<QuestionEditorState>();
  const question = form.watch(`editedQuestions.${questionId}`);

  if (!question) {
    throw new Error("There should be a question defined");
  }

  return (
    <ModalDialog
      ref={ref}
      layout="fullscreen"
      sx={{ p: 0, display: "flex", flexDirection: "column" }}
    >
      <Typography level="h3" sx={{ pl: 2, pt: 2 }}>
        {question.id}
      </Typography>
      <ModalClose sx={{ m: 1 }} />
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v as string)}
        sx={{
          flex: 1,
          [`& .${tabPanelClasses.root}`]: {
            p: 2,
            flex: 1,
            display: "flex",
          },
          [`& .${tabClasses.selected}`]: {
            color: "primary.plainColor",
          },
        }}
      >
        <TabList>
          <Tab value={"question"}>Question</Tab>
          <Tab value={"explanation"}>Explanation</Tab>
          <Tab value={"los"}>Learning Objectives</Tab>
          <Tab value={"relatedQs"}>Related Questions</Tab>
          <Tab value={"annexes"}>Annexes</Tab>
        </TabList>
        <TabPanel value={"question"} sx={{ p: 2, flex: 1 }}>
          <Grid xs={6}>
            <QuestionStandAloneComponent question={question} annexes={[]} />
          </Grid>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Typography level="h3">Preview</Typography>
              <MarkdownClientCompressed>
                {getQuestionPreview(question)}
              </MarkdownClientCompressed>

              <Typography level="h3" sx={{ mt: 2 }}>
                Explanation
              </Typography>
              <MarkdownClientCompressed>
                {form.watch(`deletedQuestions.${question.id}.explanation`)}
              </MarkdownClientCompressed>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel
          value={"explanation"}
          sx={{ p: 2, flex: 1, width: "100%", display: "flex", gap: 2 }}
        >
          <QuestionEditorTabExplanation questionId={questionId} />
        </TabPanel>
        <TabPanel value={"los"}>
          <QuestionEditorTabLearningObjectives questionId={questionId} />
        </TabPanel>
        <TabPanel value={"relatedQs"}>
          <QuestionEditorTabRelatedQuestions questionId={questionId} />
        </TabPanel>
        <TabPanel value={"annexes"}>
          <QuestionEditorTabAnnexes questionId={questionId} />
        </TabPanel>
      </Tabs>
    </ModalDialog>
  );
});
