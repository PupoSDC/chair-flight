import { startTransition, useState } from "react";
import { useFormContext } from "react-hook-form";
import { default as dynamic } from "next/dynamic";
import { useRouter } from "next/router";
import { Sheet, Typography, useColorScheme } from "@mui/joy";

import type { EditQuestionFormValues } from "../types/edit-question-form-values";
import type { ChangeEvent, FunctionComponent } from "react";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false },
);

export const EditVariantModalAsCode: FunctionComponent = () => {
  const form = useFormContext<EditQuestionFormValues>();
  const router = useRouter();
  const variantId = router.query["variantId"] as string;
  const { mode } = useColorScheme();
  const [error, setError] = useState("");
  const [code, setCode] = useState(() =>
    JSON.stringify(form.watch(`question.variants.${variantId}`), null, 2),
  );

  const onCodeChanged = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const code = evt.target.value;
    setCode(evt.target.value);
    startTransition(() => {
      try {
        const value = questionVariantSchema.parse(JSON.parse(code));
        form.setValue(`question.variants.${variantId}`, value);
        setError("");
      } catch (error) {
        setError((error as Error).message);
      }
    });
  };

  return (
    <Sheet variant="outlined" color={error ? "danger" : "neutral"}>
      <CodeEditor
        value={code}
        language="js"
        data-color-mode={mode === "dark" ? "dark" : "light"}
        placeholder="Please enter JS code."
        onChange={onCodeChanged}
        padding={16}
        style={{
          fontSize: 12,
          borderRadius: 8,
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
      {error && (
        <Typography level="body-sm" sx={{ mt: 0.5, ml: 2 }} color="danger">
          {error}
        </Typography>
      )}
    </Sheet>
  );
};
