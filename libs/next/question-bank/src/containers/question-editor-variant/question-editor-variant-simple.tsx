import { useEffect, useTransition } from "react";
import { Controller, FormProvider, get, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { Box, Sheet, Switch } from "@mui/joy";
import { getRandomId } from "@cf/base/utils";
import { questionVariantSimpleSchema } from "@cf/core/question-bank";
import { HookFormTextArea } from "@cf/react/components";
import { HookFormErrorMessage } from "@cf/react/components";
import type { QuestionVariantSimple } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";
import type { ZodError } from "zod";

const resolver = zodResolver(questionVariantSimpleSchema);

export const QuestionEditorVariantSimple: FunctionComponent<{
  variant: QuestionVariantSimple;
  setVariant: (variant: QuestionVariantSimple) => void;
}> = ({ variant: defaultValues, setVariant }) => {
  const [, startTransition] = useTransition();
  const form = useForm({ defaultValues, resolver, mode: `onChange` });
  const optionsError = get(form.formState.errors, `options`) as ZodError;

  const createOption = () => {
    const id = getRandomId();
    const options = form.getValues(`options`);
    form.setValue(`options.${options.length}`, {
      id: id,
      text: "",
      correct: false,
      why: "",
    });
    form.trigger("options");
  };

  const deleteOption = (id: string) => {
    const options = form.getValues(`options`).filter((opt) => id !== opt.id);
    form.setValue(`options`, options);
    form.trigger("options");
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      startTransition(() => setVariant(value as QuestionVariantSimple));
    });
    return () => subscription.unsubscribe();
  }, [form, setVariant]);

  return (
    <FormProvider {...form}>
      <HookFormTextArea {...form.register(`question`)} minRows={6} />
      <Divider />
      <Stack gap={1}>
        <HookFormErrorMessage name={"options"} />
        {form.watch("options").map((option, index) => {
          const optionPath = `options.${index}` as const;

          return (
            <Sheet
              key={option.id}
              sx={{ p: 1 }}
              variant="outlined"
              color={optionsError ? "danger" : "neutral"}
            >
              <Stack direction={"row"} gap={2} alignItems={"center"}>
                <Typography level="h5">Option&nbsp;{index + 1}</Typography>
                <Controller
                  name={`${optionPath}.correct`}
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        form.trigger("options");
                      }}
                      checked={field.value}
                      sx={{ width: "100%" }}
                      color={field.value ? "success" : "danger"}
                    />
                  )}
                />
                <Box sx={{ flex: 1 }} />
                <IconButton
                  variant="plain"
                  color="danger"
                  onClick={() => deleteOption(option.id)}
                  children={<CloseIcon />}
                />
              </Stack>
              <HookFormTextArea
                {...form.register(`${optionPath}.text`)}
                placeholder="Write an option here"
                minRows={1}
                sx={{ mt: 1 }}
              />
              <HookFormTextArea
                {...form.register(`${optionPath}.why`)}
                placeholder="Use This to briefly justify this option"
                minRows={1}
                sx={{ mt: 1 }}
              />
              <HookFormErrorMessage name={`${optionPath}`} />
            </Sheet>
          );
        })}
        <HookFormErrorMessage name={"options"} />
        <Button
          color="success"
          startDecorator={<AddIcon />}
          onClick={createOption}
        >
          Add Option
        </Button>
      </Stack>
    </FormProvider>
  );
};
