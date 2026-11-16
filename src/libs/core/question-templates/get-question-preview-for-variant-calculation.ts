import { getMultipleChoiceQuestionForVariantCalculation } from "./get-multiple-choice-question-for-variant-calculation.ts";
import type { QuestionTemplate } from "./question-template.ts";

export const getQuestionPreviewForVariantCalculation = (
  variant: Extract<
    QuestionTemplate,
    { type: "calculation" | "chart-calculation" }
  >,
) => {
  const { question, options, correctOptionId } =
    getMultipleChoiceQuestionForVariantCalculation(
      variant,
      variant.presets[0].id,
    );
  return [
    question,
    "",
    ...options.map(
      (option) =>
        `- ${option.id === correctOptionId ? "✅" : "❌"} ${option.text}`,
    ),
  ].join("\n");
};
