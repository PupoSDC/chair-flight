import { getMultipleChoiceQuestionForVariantChart } from "./get-multiple-choice-question-for-variant-chart.ts";
import type { QuestionTemplate } from "./question-template.ts";

export const getQuestionPreviewForVariantChart = (
  variant: Extract<QuestionTemplate, { type: "chart" }>,
) => {
  const { question, options, correctOptionId } =
    getMultipleChoiceQuestionForVariantChart(variant, variant.entries[0].id);
  return [
    question,
    "",
    ...options.map(
      (option) =>
        `- ${option.id === correctOptionId ? "✅" : "❌"} ${option.text}`,
    ),
  ].join("\n");
};
