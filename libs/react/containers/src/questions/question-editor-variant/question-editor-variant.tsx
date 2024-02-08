import { useState, useTransition } from "react";
import { default as Editor } from "@monaco-editor/react";
import { useColorScheme } from "@mui/joy";
import YAML from "yaml";
import {
  type QuestionBankName,
  questionVariantSchema,
} from "@chair-flight/core/question-bank";
import { container } from "../../wraper";
import { useQuestionEditor } from "../hooks/use-question-editor";
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
    const { mode } = useColorScheme();
    const { variant, setQuestionVariant } = useQuestionEditor((s) => ({
      variant: s[questionBank].afterState[questionId]?.variant,
      setQuestionVariant: s.setQuestionVariant,
    }));

    const [, startTransition] = useTransition();
    const [text, setText] = useState(() => YAML.stringify(variant));

    const updateVariant = (yamlInput: string | undefined = "") => {
      setText(yamlInput);
      startTransition(() => {
        const newVariantObj = YAML.parse(yamlInput);
        const variant = questionVariantSchema.parse(newVariantObj);
        setQuestionVariant({ questionBank, questionId, variant });
      });
    };

    return (
      <Editor
        defaultLanguage="yaml"
        value={text}
        onChange={updateVariant}
        theme={mode === "dark" ? "vs-dark" : "vs-light"}
        options={{
          wordWrap: "on",
        }}
      />
    );
  },
);

QuestionEditorVariant.displayName = "QuestionEditorVariant";
QuestionEditorVariant.getData = async () => ({});
QuestionEditorVariant.useData = () => ({});
