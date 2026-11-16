import { getQuestionPreviewForVariantCalculation } from "./get-question-preview-for-variant-calculation.ts";
import { getQuestionPreviewForVariantChart } from "./get-question-preview-for-variant-chart.ts";
import { getQuestionPreviewForVariantDefinition } from "./get-question-preview-for-variant-definition.ts";
import { getQuestionPreviewForVariantMultipleCorrect } from "./get-question-preview-for-variant-multiple-correct.ts";
import { getQuestionPreviewForVariantOneTwo } from "./get-question-preview-for-variant-one-two.ts";
import { getQuestionPreviewForVariantSimple } from "./get-question-preview-for-variant-simple.ts";
import { getQuestionPreviewForVariantTrueOrFalse } from "./get-question-preview-for-variant-true-or-false.ts";
import type { QuestionTemplate } from "./question-template.ts";

export const getQuestionPreview = (variant: QuestionTemplate) => {
  switch (variant.type) {
    case "simple":
      return getQuestionPreviewForVariantSimple(variant);
    case "multiple-correct":
      return getQuestionPreviewForVariantMultipleCorrect(variant);
    case "true-or-false":
      return getQuestionPreviewForVariantTrueOrFalse(variant);
    case "one-two":
      return getQuestionPreviewForVariantOneTwo(variant);
    case "definition":
      return getQuestionPreviewForVariantDefinition(variant);
    case "chart":
      return getQuestionPreviewForVariantChart(variant);
    case "chart-calculation":
      return getQuestionPreviewForVariantCalculation(variant);
    case "calculation":
      return getQuestionPreviewForVariantCalculation(variant);
  }
};
