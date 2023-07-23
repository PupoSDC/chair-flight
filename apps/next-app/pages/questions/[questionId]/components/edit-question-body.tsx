import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Option,
  Button,
} from "@mui/joy";
import { getNewVariant } from "@chair-flight/core/app";
import {
  actions,
  useAppDispatch,
  useAppSelector,
} from "@chair-flight/core/redux";
import { InputAutocompleteLearningObjectives } from "./input-autocomplete-learning-objectives";
import type { QuestionVariantType } from "@chair-flight/base/types";
import type { FunctionComponent } from "react";

export type EditQuestionBodyProps = {
  questionId: string;
};

export const EditQuestionBody: FunctionComponent<EditQuestionBodyProps> = ({
  questionId,
}) => {
  const [newVariantType, setNewVariantType] =
    useState<QuestionVariantType>("simple");
  const dispatch = useAppDispatch();
  const question = useAppSelector(
    (state) => state.questionEditor.questions[questionId]?.currentVersion,
  );

  if (!question) return null;

  const updateLearningObjectives = (learningObjectives: string[]) => {
    dispatch(
      actions.updateQuestionLearningObjectives({
        questionId,
        learningObjectives,
      }),
    );
  };

  const updateExplanation = (explanation: string) => {
    dispatch(
      actions.updateQuestionExplanation({
        questionId,
        explanation,
      }),
    );
  };

  const addNewVariant = () => {
    dispatch(
      actions.createNewQuestionVariant({
        questionId,
        variant: getNewVariant(newVariantType),
      }),
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <FormControl>
        <FormLabel>Learning Objectives</FormLabel>
        <InputAutocompleteLearningObjectives
          value={question.learningObjectives}
          onChange={updateLearningObjectives}
        />
      </FormControl>
      <FormControl sx={{ mt: 1 }}>
        <FormLabel>Explanation</FormLabel>
        <Textarea
          minRows={5}
          defaultValue={question.explanation}
          onBlur={(evt) => updateExplanation(evt.target.value)}
        />
      </FormControl>
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
        sx={{ mt: 1 }}
        onClick={() => addNewVariant()}
        children="Create new Variant"
      />
    </Box>
  );
};
