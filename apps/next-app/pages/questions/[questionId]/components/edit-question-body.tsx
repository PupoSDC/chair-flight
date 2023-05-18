import { Box, FormControl, FormLabel, Textarea } from "@mui/joy";
import {
  actions,
  useAppDispatch,
  useAppSelector,
} from "@chair-flight/core/redux";
import { InputAutocompleteLearningObjectives } from "./input-autocomplete-learning-objectives";
import type { FunctionComponent } from "react";

export type EditQuestionBodyProps = {
  questionId: string;
};

export const EditQuestionBody: FunctionComponent<EditQuestionBodyProps> = ({
  questionId,
}) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector(
    (state) => state.questionEditor.questions[questionId]?.currentVersion
  );

  if (!question) return null;

  const updateLearningObjectives = (learningObjectives: string[]) => {
    dispatch(
      actions.updateQuestionLearningObjectives({
        questionId,
        learningObjectives,
      })
    );
  };

  const updateExplanation = (explanation: string) => {
    dispatch(
      actions.updateQuestionExplanation({
        questionId,
        explanation,
      })
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
    </Box>
  );
};
