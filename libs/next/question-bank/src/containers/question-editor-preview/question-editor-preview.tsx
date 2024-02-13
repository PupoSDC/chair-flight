import { useState } from "react";
import { default as Editor } from "@monaco-editor/react";
import {
  TabList,
  Tabs,
  Tab,
  tabClasses,
  TabPanel,
  tabPanelClasses,
  useColorScheme,
} from "@mui/joy";
import YAML from "yaml";
import { getRandomId } from "@chair-flight/base/utils";
import { getQuestionPreview } from "@chair-flight/core/question-bank";
import { createTestQuestion } from "@chair-flight/core/tests";
import { container } from "@chair-flight/trpc/client";
import { MarkdownFromServer } from "../../components/markdown-from-server";
import { useQuestionEditor } from "../../hooks/use-question-editor";
import { QuestionStandAloneComponent } from "../question-stand-alone/question-stand-alone";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorPreview"];

export const QuestionEditorPreview = container<Props, Params, Data>(
  ({ questionId, questionBank, component = "div", sx }) => {
    const { mode } = useColorScheme();
    const [seed, setSeed] = useState(getRandomId());

    const { explanation, variant, template } = useQuestionEditor((s) => ({
      template: s[questionBank].afterState[questionId],
      variant: s[questionBank].afterState[questionId]?.variant,
      explanation: s[questionBank].afterState[questionId]?.explanation ?? "",
      setQuestionExplanation: s.setQuestionExplanation,
    }));

    if (!template || !variant) return null;
    return (
      <Tabs
        defaultValue={"Preview"}
        component={component}
        sx={{
          background: "transparent",
          ...sx,

          [`& .${tabPanelClasses.root}`]: {
            flex: 1,
            overflow: "hidden",
            backgroundColor: "background.surface",
            border: "solid 1px var(--joy-palette-divider)",
            borderRadius: 4,
            my: 1,
            py: 0,
          },

          [`& .${tabClasses.selected}`]: {
            color: "primary.plainColor",
            background: "transparent",
          },
        }}
      >
        <TabList sx={{ justifyContent: "center" }}>
          <Tab value={"Preview"}>Preview</Tab>
          <Tab value={"Demo"}>Demo</Tab>
          <Tab value={"Explanation"}>Explanation</Tab>
          <Tab value={"Json"}>JSON</Tab>
          <Tab value={"Validation"}>Validation</Tab>
        </TabList>
        <TabPanel value={"Preview"} sx={{ px: 1 }}>
          <MarkdownFromServer>{getQuestionPreview(variant)}</MarkdownFromServer>
        </TabPanel>
        <TabPanel value={"Demo"} sx={{ px: 1 }}>
          <QuestionStandAloneComponent
            questionBank={questionBank}
            questionId={questionId}
            seed={seed}
            onNavigateToNewSeed={({ seed }) => setSeed(seed)}
            question={createTestQuestion(template, { seed })}
            annexes={[]}
          />
        </TabPanel>
        <TabPanel value={"Explanation"} sx={{ px: 1 }}>
          <MarkdownFromServer>{explanation}</MarkdownFromServer>
        </TabPanel>
        <TabPanel value={"Json"} sx={{ px: 0 }}>
          <Editor
            language="yaml"
            value={YAML.stringify(template, null, 2)}
            theme={mode === "dark" ? "vs-dark" : "vs-light"}
            options={{ readOnly: true, wordWrap: "on" }}
          />
        </TabPanel>
        <TabPanel value={"Diff"} sx={{ px: 0 }}>
          <Editor
            language="yaml"
            value={"123"}
            options={{
              readOnly: true,
              wordWrap: "on",
              theme: mode === "dark" ? "vs-dark" : "vs-light",
            }}
          />
        </TabPanel>
      </Tabs>
    );
  },
);

QuestionEditorPreview.displayName = "QuestionEditorPreview";
QuestionEditorPreview.getData = async () => ({});
QuestionEditorPreview.useData = () => ({});
