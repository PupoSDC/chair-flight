import { useState, useTransition } from "react";
import { default as Editor } from "@monaco-editor/react";
import { useColorScheme } from "@mui/joy";
import { container } from "@cf/trpc/client";
import { useQuestionEditor } from "../../hooks/use-question-editor";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { AppRouterOutput } from "@cf/trpc/server";

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
  ({ questionId, questionBank }) => {
    const { mode } = useColorScheme();
    const { explanation, setQuestionExplanation } = useQuestionEditor((s) => ({
      explanation: s[questionBank].afterState[questionId]?.explanation ?? "",
      setQuestionExplanation: s.setQuestionExplanation,
    }));

    const [thisExplanation, setThisExplanation] = useState(explanation);
    const [, startTransition] = useTransition();

    const updateExplanation = (mdInput: string | undefined = "") => {
      setThisExplanation(mdInput);
      startTransition(() =>
        setQuestionExplanation({
          questionBank,
          questionId,
          explanation: mdInput,
        }),
      );
    };

    return (
      <Editor
        className="vs-code-editor"
        defaultLanguage="markdown"
        value={thisExplanation}
        onChange={updateExplanation}
        theme={mode === "dark" ? "vs-dark" : "vs-light"}
        options={{
          wordWrap: "on",
        }}
      />
    );
  },
);

QuestionEditorExplanation.displayName = "QuestionEditorExplanation";
QuestionEditorExplanation.getData = async () => ({});
QuestionEditorExplanation.useData = () => ({});
