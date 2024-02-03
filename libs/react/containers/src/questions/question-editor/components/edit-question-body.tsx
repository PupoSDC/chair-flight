import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, FormLabel, Select, Option, Button } from "@mui/joy";
import { getNewVariant } from "@chair-flight/core/app";
import { HookFormTextArea } from "@chair-flight/react/components";
import { useFormHistory } from "../../../hooks/use-form-history/use-form-history";
import { InputAutocompleteLearningObjectives } from "./input-autocomplete-learning-objectives";
import type { EditQuestionFormValues } from "../types/edit-question-form-values";
import type { QuestionVariantType } from "@chair-flight/core/question-bank";
import type { FunctionComponent } from "react";

export const EditQuestionBody: FunctionComponent = () => {
  const form = useFormContext<EditQuestionFormValues>();
  const history = useFormHistory(form.watch("question.id"));

  const [newVariantType, setNewVariantType] =
    useState<QuestionVariantType>("simple");

  const addNewVariant = () => {
    const newVariant = getNewVariant(newVariantType);
    form.setValue(`question.variants.${newVariant.id}`, newVariant);
    history.save();
  };

  return (
    <Box sx={{ p: 1 }} onBlur={() => history.save()}>
      <FormControl>
        <FormLabel>Learning Objectives</FormLabel>
        <Controller
          control={form.control}
          name="question.learningObjectives"
          render={({ field }) => (
            <InputAutocompleteLearningObjectives {...field} />
          )}
        />
      </FormControl>
      <FormLabel sx={{ mt: 1 }}>Explanation</FormLabel>
      <HookFormTextArea
        {...form.register("question.explanation")}
        minRows={5}
        sx={{ mt: 1 }}
      />
      <FormControl sx={{ mt: 1 }}>
        <FormLabel>Create New Variant</FormLabel>
        <Select
          value={newVariantType}
          onChange={(_, v) => v && setNewVariantType(v)}
        >
          <Option value="simple">Simple</Option>
          <Option value="one-two">OneTwo</Option>
          <Option disabled value="calculation">
            Calculation
          </Option>
        </Select>
      </FormControl>
      <Button
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => addNewVariant()}
        children="Create new Variant"
      />
    </Box>
  );
};
