import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  ModalDialog,
  Typography,
  Grid,
} from "@mui/joy";
import { z } from "zod";
import { getVariantPreview } from "@chair-flight/core/app";
import { actions, useAppDispatch } from "@chair-flight/core/redux";
import { questionVariantSchema } from "@chair-flight/question-bank/schemas";
import { AppLayout, MarkdownClient } from "@chair-flight/react/components";
import { EditVariantFormSnippetOneTwo } from "./edit-variant-form-snippet-one-two";
import { EditVariantFormSnippetSimple } from "./edit-variant-form-snippet-simple";
import { InputCommaSeparatedValues } from "./input-comma-seperated-values";
import type { QuestionVariant } from "@chair-flight/base/types";
import type { FunctionComponent } from "react";

const resolver = zodResolver(
  z.object({
    variant: questionVariantSchema,
  }),
);

export type EditQuestionVariantFormProps = {
  questionId: string;
  variant: QuestionVariant;
};

export const EditVariantModalDialog: FunctionComponent<
  EditQuestionVariantFormProps
> = ({ variant, questionId }) => {
  const defaultValues = { variant };
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm({ resolver, defaultValues });
  const { watch, setValue, handleSubmit } = form;

  const closeModal = () => {
    delete router.query["variantId"];
    router.replace(router);
  };

  const saveAndCloseModal = handleSubmit(({ variant }) => {
    dispatch(actions.updateQuestionVariant({ questionId, variant }));
    closeModal();
  });

  const variantSpecificFormSnippet = {
    simple: <EditVariantFormSnippetSimple />,
    "one-two": <EditVariantFormSnippetOneTwo />,
    calculation: `Not implemented yet :(`,
  }[variant.type];

  return (
    <ModalDialog
      layout="fullscreen"
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
            children="Save"
            onClick={saveAndCloseModal}
          />
        </Box>
      </AppLayout.Header>
      <Grid container spacing={2} sx={{ height: "100%", overflow: "hidden" }}>
        <Grid xs={8} sx={{ overflow: "scroll", height: "100%", pr: 2 }}>
          <FormProvider {...form}>{variantSpecificFormSnippet}</FormProvider>
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
        </Grid>
        <Grid md={4}>
          <MarkdownClient>{getVariantPreview(watch("variant"))}</MarkdownClient>
        </Grid>
      </Grid>
    </ModalDialog>
  );
};
