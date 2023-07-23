import { useId, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Sheet,
  Switch,
  Textarea,
} from "@mui/joy";
import { getRandomIdGenerator } from "@chair-flight/core/app";
import { HookFormTextArea } from "@chair-flight/react/components";
import type { QuestionVariantSimple } from "@chair-flight/base/types";
import type { FunctionComponent } from "react";

export const EditVariantFormSnippetSimple: FunctionComponent = () => {
  const randomSeed = useId();
  const [getRandomId] = useState(() => getRandomIdGenerator(randomSeed));
  const { control, register, setValue, watch, formState } = useFormContext<{
    variant: QuestionVariantSimple;
  }>();

  const options = watch("variant.options");

  const createOption = () => {
    const id = getRandomId();
    setValue(`variant.options.${options.length}`, {
      id: id,
      text: "",
      correct: false,
      why: "",
    });
  };

  const deleteOption = (id: string) => {
    setValue(
      `variant.options`,
      options.filter((opt) => id !== opt.id),
    );
  };

  return (
    <>
      <FormControl sx={{ mt: 1 }}>
        <FormLabel>Question</FormLabel>
        <Textarea
          placeholder="Write a question here"
          {...register("variant.question")}
        />
      </FormControl>
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
      {options.map((option, index) => (
        <Sheet key={option.id} sx={{ p: 1, my: 1 }} variant="outlined">
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Controller
              name={`variant.options.${index}.correct`}
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
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
          <FormControl sx={{ mt: 1 }}>
            <FormLabel>Text</FormLabel>
            <HookFormTextArea
              minRows={1}
              placeholder="Write an option here"
              errors={formState.errors}
              {...register(`variant.options.${index}.text`)}
            />
          </FormControl>
          <FormControl sx={{ my: 1 }}>
            <FormLabel>why</FormLabel>
            <HookFormTextArea
              minRows={1}
              placeholder="use This to briefly justify this option"
              errors={formState.errors}
              {...register(`variant.options.${index}.why`)}
            />
          </FormControl>
        </Sheet>
      ))}
    </>
  );
};
