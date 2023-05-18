import { useId, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { default as CloseIcon } from "@mui/icons-material/Close";
import { default as CreateIcon } from "@mui/icons-material/Create";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Sheet,
  Switch,
  Typography,
} from "@mui/joy";
import { getRandomIdGenerator } from "@chair-flight/core/app";
import { AppLayout } from "@chair-flight/react/components";
import { AutoExpandTextArea } from "./AutoExpandTextArea";
import type { QuestionVariant } from "@chair-flight/base/types";
import type { FunctionComponent } from "react";

export const EditVariantFormSnippetSimple: FunctionComponent = () => {
  const randomSeed = useId();
  const [getRandomId] = useState(() => getRandomIdGenerator(randomSeed));
  const { control, register, setValue, watch } = useFormContext<{
    variant: QuestionVariant;
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

  return (
    <>
      <AppLayout.Header>
        <Typography level="h5">Options</Typography>
        <IconButton
          variant="plain"
          color="success"
          children={<CreateIcon />}
          onClick={createOption}
        />
      </AppLayout.Header>
      {options.map((option, index) => (
        <Sheet key={option.id} sx={{ p: 2, my: 1 }} variant="outlined">
          <AppLayout.Header>
            <FormControl sx={{ my: 1, alignItems: "flex-start" }}>
              <Controller
                name={`variants.${variant.id}.options.${index}.correct`}
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
            </FormControl>
            <Box sx={{ flex: 1 }} />
            <IconButton
              variant="plain"
              color="danger"
              onClick={() =>
                setValue(
                  `variants.${variant.id}.options`,
                  variant.options.filter((_, i) => i !== index)
                )
              }
            >
              <CloseIcon />
            </IconButton>
          </AppLayout.Header>
          <FormControl sx={{ mt: 1 }}>
            <FormLabel>Text</FormLabel>
            <AutoExpandTextArea
              {...register(`variants.${variant.id}.options.${index}.text`)}
            />
          </FormControl>
          <FormControl sx={{ my: 1 }}>
            <FormLabel>why</FormLabel>
            <AutoExpandTextArea
              placeholder="use This to briefly justify this option"
              {...register(`variants.${variant.id}.options.${index}.why`)}
            />
          </FormControl>
        </Sheet>
      ))}
    </>
  );
};
