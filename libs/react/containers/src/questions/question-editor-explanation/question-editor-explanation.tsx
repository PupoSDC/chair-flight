import { useState, useTransition } from "react";
import { CircularProgress, Sheet, Stack, Textarea } from "@mui/joy";
import { MarkdownClientCompressed, Ups } from "@chair-flight/react/components";
import { container } from "../../wraper";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorExplanation"];

export const QuestionEditorExplanation = container<Props, Params, Data>(
  ({ questionId, questionBank, sx, component = "div" }) => {
    const { explanation, setQuestionExplanation } = useQuestionEditor((s) => ({
      explanation: s[questionBank].afterState[questionId]?.explanation ?? "",
      setQuestionExplanation: s.setQuestionExplanation,
    }));

    const [thisExplanation, setThisExplanation] = useState(explanation);
    const [isPending, startTransition] = useTransition();

    return (
      <Stack direction="row" height="100%" sx={sx} component={component}>
        <Textarea
          value={thisExplanation}
          sx={{ height: "100%", flex: 1 }}
          onChange={(e) => {
            const explanation = e.target.value;
            setThisExplanation(explanation);
            startTransition(() =>
              setQuestionExplanation({ questionBank, questionId, explanation }),
            );
          }}
        />
        <VerticalDivider />
        <Sheet sx={{ flex: 1, p: 1, position: "relative" }}>
          {explanation ? (
            <MarkdownClientCompressed>{explanation}</MarkdownClientCompressed>
          ) : (
            <Ups message="No explanation provided" />
          )}
          {isPending && (
            <CircularProgress
              size="lg"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </Sheet>
      </Stack>
    );
  },
);

QuestionEditorExplanation.displayName = "QuestionEditorExplanation";
QuestionEditorExplanation.getData = async () => ({});
QuestionEditorExplanation.useData = () => ({});
