import { useId, useState } from "react";
import { Controller, get, useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
import { Box, FormLabel, IconButton, Sheet, Switch } from "@mui/joy";
import { getRandomIdGenerator } from "@chair-flight/base/utils";
import {
  HookFormErrorMessage,
  HookFormTextArea,
} from "@chair-flight/react/components";
import type { EditQuestionFormValues } from "../types/edit-question-form-values";
import type { QuestionVariantSimple } from "@chair-flight/base/types";
import type { FunctionComponent } from "react";
import type { ZodError } from "zod";

export const EditVariantModalSimple: FunctionComponent = () => {
  const router = useRouter();
  const form = useFormContext<EditQuestionFormValues>();
  const randomSeed = useId();
  const [getRandomId] = useState(() => getRandomIdGenerator(randomSeed));
  const variantId = router.query["variantId"] as string;
  const options = form.watch(
    `question.variants.${variantId}.options`,
  ) as QuestionVariantSimple["options"];
  const optionsError = get(
    form.formState.errors,
    `variants.${variantId}.options`,
  ) as ZodError;

  const createOption = () => {
    const id = getRandomId();
    form.setValue(`question.variants.${variantId}.options.${options.length}`, {
      id: id,
      text: "",
      correct: false,
      why: "",
    });
  };

  const deleteOption = (id: string) => {
    form.setValue(
      `question.variants.${variantId}.options`,
      options.filter((opt) => id !== opt.id),
    );
  };

  return (
    <>
      <HookFormTextArea
        {...form.register(`question.variants.${variantId}.question`)}
        formLabel={"Question"}
        minRows={1}
      />
      <FormLabel sx={{ mt: 1 }}>
        Options
        <IconButton
          sx={{ ml: "auto" }}
          variant="plain"
          color="success"
          onClick={createOption}
          children={<AddIcon />}
        />
      </FormLabel>
      {options.map((option, index) => {
        const optionPath =
          `question.variants.${variantId}.options.${index}` as const;

        return (
          <Sheet
            key={option.id}
            sx={{ p: 1, my: 1 }}
            variant="outlined"
            color={optionsError ? "danger" : "neutral"}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Controller
                name={`${optionPath}.correct`}
                control={form.control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value}
                    sx={{ width: "100%" }}
                    color={field.value ? "success" : "danger"}
                    endDecorator={field.value ? "Correct" : "Wrong"}
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
            </Box>
            <HookFormTextArea
              {...form.register(`${optionPath}.text`)}
              placeholder="Write an option here"
              minRows={1}
              sx={{ mt: 1 }}
            />
            <HookFormTextArea
              {...form.register(`${optionPath}.why`)}
              placeholder="Use This to briefly justify this option"
              formLabel="Why"
              minRows={1}
              sx={{ mt: 1 }}
            />
            <HookFormErrorMessage name={`${optionPath}`} />
          </Sheet>
        );
      })}
    </>
  );
};
