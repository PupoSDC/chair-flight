import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  ModalDialog,
  Select,
  Typography,
  Option,
} from "@mui/joy";
import { z } from "zod";
import { questionVariantSchema } from "@chair-flight/question-bank/schemas";
import { AppLayout } from "@chair-flight/react/components";
import { EditVariantFormSnippetOneTwo } from "./edit-variant-form-snippet-one-two";
import { EditVariantFormSnippetSimple } from "./edit-variant-form-snippet-simple";
import { InputCommaSeparatedValues } from "./input-comma-seperated-values";
import type { QuestionVariant } from "@chair-flight/base/types";
import type { FunctionComponent } from "react";

const resolver = zodResolver(
  z.object({
    variant: questionVariantSchema,
  })
);

export type EditQuestionVariantFormProps = {
  questionId: string;
  variant: QuestionVariant;
};

export const EditVariantForm: FunctionComponent<
  EditQuestionVariantFormProps
> = ({ questionId, variant }) => {
  const defaultValues = { variant };
  const router = useRouter();
  const form = useForm({ resolver, defaultValues });
  const { register, handleSubmit, control, watch, setValue } = form;

  const closeModal = () => {
    delete router.query["variantId"];
    router.replace(router);
  };

  return (
    <ModalDialog
      component="form"
      sx={{ minWidth: (t) => t.breakpoints.values.md }}
    >
      <AppLayout.Header>
        <Typography>Edit Variant</Typography>
        <Box sx={{ display: "flex" }}>
          <Button
            color="danger"
            variant="outlined"
            onClick={closeModal}
            children="Discard"
            sx={{ mr: 2 }}
          />
          <Button
            color="success"
            variant="solid"
            role="submit"
            children="Save"
            onClick={closeModal}
          />
        </Box>
      </AppLayout.Header>
      <FormProvider {...form}>
        <FormControl sx={{ mt: 1 }}>
          <FormLabel>Select Variant</FormLabel>
          <Select
            value={watch("variant.type")}
            onChange={(_, v) => v && setValue("variant.type", v)}
          >
            <Option value="simple">Simple</Option>
            <Option value="one-two">OneTwo</Option>
            <Option value="calculation">Calculation</Option>
          </Select>
        </FormControl>
        {/**
                    {
                        simple: <EditVariantFormSnippetSimple variantId={variant.id} />,
                        "one-two": <EditVariantFormSnippetOneTwo variantId={variant.id} />,
                        calculation: `Not implemented yet :(`,
                    }[variant.type]
                 */}
        <FormControl sx={{ mt: 1 }}>
          <FormLabel>Annexes</FormLabel>
          <InputCommaSeparatedValues
            value={watch("variant.annexes")}
            onChange={(v) => setValue("variant.annexes", v)}
          />
        </FormControl>
        <FormControl sx={{ mt: 1 }}>
          <FormLabel>External Ids</FormLabel>
          <InputCommaSeparatedValues
            value={watch("variant.externalIds")}
            onChange={(v) => setValue("variant.externalIds", v)}
          />
        </FormControl>
      </FormProvider>
    </ModalDialog>
  );
};
