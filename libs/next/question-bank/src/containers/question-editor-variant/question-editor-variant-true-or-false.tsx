import { useEffect, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Divider, FormLabel } from "@mui/joy";
import { Switch } from "@mui/joy";
import { questionVariantTrueOrFalseSchema } from "@cf/core/question-bank";
import { HookFormTextArea } from "@cf/react/ui";
import type { QuestionVariantTrueOrFalse } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

const resolver = zodResolver(questionVariantTrueOrFalseSchema);

export const QuestionEditorVariantTrueOrFalse: FunctionComponent<{
  variant: QuestionVariantTrueOrFalse;
  setVariant: (variant: QuestionVariantTrueOrFalse) => void;
}> = ({ variant: defaultValues, setVariant }) => {
  const [, startTransition] = useTransition();
  const form = useForm({ defaultValues, resolver, mode: `onChange` });

  useEffect(() => {
    const subscription = form.watch((value) => {
      startTransition(() => setVariant(value as QuestionVariantTrueOrFalse));
    });
    return () => subscription.unsubscribe();
  }, [form, setVariant]);

  return (
    <FormProvider {...form}>
      <HookFormTextArea {...form.register(`question`)} minRows={6} />
      <Divider />
      <FormLabel>Answer</FormLabel>
      <Switch
        onChange={(e) => form.setValue("answer", e.target.checked)}
        checked={form.watch("answer")}
        sx={{ width: "100%" }}
        color={form.watch("answer") ? "success" : "danger"}
      />
    </FormProvider>
  );
};
