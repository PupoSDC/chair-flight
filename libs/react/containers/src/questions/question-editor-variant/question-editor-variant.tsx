import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Divider, Stack, Typography } from "@mui/joy";
import { Switch } from "@mui/joy";
import { getRandomId } from "@chair-flight/base/utils";
import {
  createTestQuestion,
  getQuestionPreview,
  type QuestionBankName,
} from "@chair-flight/core/question-bank";
import { MarkdownClient } from "@chair-flight/react/components";
import { container } from "../../wraper";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import { QuestionStandAloneComponent } from "../question-stand-alone/question-stand-alone";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorVariant"];

export const QuestionEditorVariant = container<Props, Params, Data>(
  ({ questionId, questionBank }) => {
    const [showDemo, setShowDemo] = useState(false);
    const [seed, setSeed] = useState(getRandomId());
    const field = `editedQuestions.${questionId}` as const;
    const { form } = useQuestionEditor({ questionBank });

    const template = form.watch(field);
    // const variant = template?.variant;

    if (!template) return null;

    return (
      <FormProvider {...form}>
        <Stack direction="row" height="100%" width="100%">
          <Stack height="100%" flex={1}></Stack>
          <VerticalDivider />
          <Stack height="100%" flex={1}>
            <Stack direction="row" justifyContent={"center"}>
              <Typography level="h5">Preview</Typography>
              <Switch
                size="lg"
                checked={showDemo}
                onChange={() => setShowDemo(!showDemo)}
                sx={{ mx: 1 }}
              />
              <Typography level="h5">Demo</Typography>
            </Stack>
            <Divider sx={{ mt: 1 }} />
            {showDemo ? (
              <QuestionStandAloneComponent
                questionBank={questionBank}
                questionId={questionId}
                seed={seed}
                onNavigateToNewSeed={({ seed }) => setSeed(seed)}
                question={createTestQuestion(template, { seed })}
                annexes={[]}
              />
            ) : (
              <MarkdownClient>{getQuestionPreview(template)}</MarkdownClient>
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
