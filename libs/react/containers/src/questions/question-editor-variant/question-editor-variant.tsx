import { useState } from "react";
import { FormProvider, get } from "react-hook-form";
import { Button, ButtonGroup, Divider, Option, Select, Stack, Typography } from "@mui/joy";
import { Switch } from "@mui/joy";
import { getRandomId } from "@chair-flight/base/utils";
import {
  createTestQuestion,
  getQuestionPreview,
  questionTemplateSchema,
  type QuestionBankName,
} from "@chair-flight/core/question-bank";
import { HookFormSelect, MarkdownClient } from "@chair-flight/react/components";
import { container } from "../../wraper";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import { QuestionStandAloneComponent } from "../question-stand-alone/question-stand-alone";
import type { AppRouterOutput } from "@chair-flight/trpc/server";
import { QuestionEditorVariantSimple } from "./question-editor-variant-simple";
import { default as Editor } from '@monaco-editor/react';
import YAML from 'yaml'


type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorVariant"];

type RhsMode = "preview" | "demo" | "validation";

export const QuestionEditorVariant = container<Props, Params, Data>(
  ({ questionId, questionBank }) => {
    const [rhsMode, setRhsMode] = useState<RhsMode>("preview");
    const [seed, setSeed] = useState(getRandomId());
    const field = `editedQuestions.${questionId}` as const;
    const { form } = useQuestionEditor({ questionBank });

    const template = form.watch(field);
    // const variant = template?.variant;

    const validation = questionTemplateSchema.safeParse(template);

    if (!template) return null;

    return (
      <FormProvider {...form}>
        <Stack direction="row" height="100%" width="100%">
          <Stack height="100%" flex={1} sx={{ overflowY: "scroll" }}>
            <Editor 
              defaultLanguage="yaml"
              defaultValue={YAML.stringify(template.variant, null, 2)}
              options={{ readOnly: true, wordWrap: 'on' }}
            />
          </Stack>
          <VerticalDivider />
          <Stack height="100%" flex={1}>
            <ButtonGroup
              variant="solid"
              buttonFlex={1}
              sx={{ margin: "auto", m: 1 }}
            >
              <Button
                color={rhsMode === "preview" ? "primary" : undefined}
                onClick={() => setRhsMode("preview")}
              >
                Preview
              </Button>
              <Button
                color={rhsMode === "demo" ? "primary" : undefined}
                onClick={() => setRhsMode("demo")}
              >
                Demo
              </Button>
              <Button
                color={rhsMode === "validation" ? "primary" : undefined}
                onClick={() => setRhsMode("validation")}
              >
                Validation
              </Button>
            </ButtonGroup>
            <Divider />

            {rhsMode === "demo" && (
              <QuestionStandAloneComponent
                questionBank={questionBank}
                questionId={questionId}
                seed={seed}
                onNavigateToNewSeed={({ seed }) => setSeed(seed)}
                question={createTestQuestion(template, { seed })}
                annexes={[]}
              />
            )}
            {rhsMode === "preview" && (
              <MarkdownClient>{getQuestionPreview(template)}</MarkdownClient>
            )}
            {rhsMode === "validation" && validation.success === true && (
              <>YEay!</>
            )}
            {rhsMode === "validation" && validation.success === false && (
              <Editor 
                defaultLanguage="yaml"
                defaultValue={YAML.stringify(validation.error.issues)}
                options={{ readOnly: true, wordWrap: 'on' }}
              />
            )}
          </Stack>
        </Stack>
      </FormProvider>
    );
  },
);

QuestionEditorVariant.displayName = "QuestionEditorVariant";
QuestionEditorVariant.getData = async () => ({});
QuestionEditorVariant.useData = () => ({});
