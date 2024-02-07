import { useState, useTransition } from "react";
import { Textarea } from "@mui/joy";
import { container } from "../../wraper";
import { useQuestionEditor } from "../hooks/use-question-editor";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
  component?: "textarea";
};

type Params = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorExplanation"];

export const QuestionEditorExplanation = container<Props, Params, Data>(
  ({ questionId, questionBank, sx }) => {
    const { explanation, setQuestionExplanation } = useQuestionEditor((s) => ({
      explanation: s[questionBank].afterState[questionId]?.explanation ?? "",
      setQuestionExplanation: s.setQuestionExplanation,
    }));

    const [thisExplanation, setThisExplanation] = useState(explanation);
    const [, startTransition] = useTransition();

    return (
      <Textarea
        value={thisExplanation}
        sx={{ height: "100%", flex: 1, ...sx }}
        onChange={(e) => {
          const explanation = e.target.value;
          setThisExplanation(explanation);
          startTransition(() =>
            setQuestionExplanation({ questionBank, questionId, explanation }),
          );
        }}
      />
    );
  },
);

QuestionEditorExplanation.displayName = "QuestionEditorExplanation";
QuestionEditorExplanation.getData = async () => ({});
QuestionEditorExplanation.useData = () => ({});
