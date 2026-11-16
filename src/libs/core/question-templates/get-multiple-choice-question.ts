import { getMultipleChoiceQuestionForVariantCalculation } from "./get-multiple-choice-question-for-variant-calculation.ts";
import { getMultipleChoiceQuestionForVariantChart } from "./get-multiple-choice-question-for-variant-chart.ts";
import { getMultipleChoiceQuestionForVariantDefinition } from "./get-multiple-choice-question-for-variant-definition.ts";
import { getMultipleChoiceQuestionForVariantMultipleCorrect } from "./get-multiple-choice-question-for-variant-multiple-correct.ts";
import { getMultipleChoiceQuestionForVariantOneTwo } from "./get-multiple-choice-question-for-variant-one-two.ts";
import { getMultipleChoiceQuestionForVariantSimple } from "./get-multiple-choice-question-for-variant-simple.ts";
import { getMultipleChoiceQuestionForVariantTrueOrFalse } from "./get-multiple-choice-question-for-variant-true-or-false.ts";
import type { QuestionTemplate } from "./question-template.ts";

export const getMultipleChoiceQuestion = (
  variant: QuestionTemplate,
  seed: string,
): {
  question: string;
  correctOptionId: string;
  options: {
    id: string;
    text: string;
    why: string;
  }[];
  explanation?: string;
} => {
  switch (variant.type) {
    case "simple":
      return getMultipleChoiceQuestionForVariantSimple(variant, seed);
    case "true-or-false":
      return getMultipleChoiceQuestionForVariantTrueOrFalse(variant);
    case "one-two":
      return getMultipleChoiceQuestionForVariantOneTwo(variant, seed);
    case "definition":
      return getMultipleChoiceQuestionForVariantDefinition(variant, seed);
    case "multiple-correct":
      return getMultipleChoiceQuestionForVariantMultipleCorrect(variant, seed);
    case "chart":
      return getMultipleChoiceQuestionForVariantChart(variant, seed);
    case "chart-calculation":
      return getMultipleChoiceQuestionForVariantCalculation(variant, seed);
    case "calculation":
      return getMultipleChoiceQuestionForVariantCalculation(variant, seed);
  }
};
