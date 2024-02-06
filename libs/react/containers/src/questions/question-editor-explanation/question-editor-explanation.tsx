import { FormProvider } from "react-hook-form";
import { Sheet, Stack, textareaClasses } from "@mui/joy";
import { QuestionBankName } from "@chair-flight/core/question-bank";
import {
  HookFormTextArea,
  MarkdownClientCompressed,
  Ups,
} from "@chair-flight/react/components";
import { AppRouterOutput } from "@chair-flight/trpc/server";
import { container } from "../../wraper";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorExplanation"];

export const QuestionEditorExplanation = container<Props, Params, Data>(
  ({ questionId, questionBank }) => {
    const { form } = useQuestionEditor({ questionBank });
    const explanation = form.watch(`editedQuestions.${questionId}.explanation`);

    return (
      <FormProvider {...form}>
        <Stack direction="row" height="100%">
          <HookFormTextArea
            {...form.register(`editedQuestions.${questionId}.explanation`)}
            sx={{
              flex: 1,
              height: "100%",
              [`& .${textareaClasses.root}`]: { height: "100%" },
            }}
          />
          <VerticalDivider />
          <Sheet sx={{ flex: 1, p: 1 }}>
            {explanation ? (
              <MarkdownClientCompressed>{explanation}</MarkdownClientCompressed>
            ) : (
              <Ups message="No explanation provided" />
            )}
          </Sheet>
        </Stack>
      </FormProvider>
    );
  },
);

QuestionEditorExplanation.displayName = "QuestionEditorExplanation";
QuestionEditorExplanation.getData = async () => ({});
QuestionEditorExplanation.useData = () => ({});
