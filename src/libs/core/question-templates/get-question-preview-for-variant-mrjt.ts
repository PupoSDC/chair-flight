import { getMultipleChoiceQuestionForVariantMrjt } from "./get-multiple-choice-question-for-variant-mrjt.ts";
import type { QuestionTemplate } from "./question-template.ts";

export const getQuestionPreviewForVariantMrjt = (
  variant: Extract<QuestionTemplate, { type: "mrjt" }>,
) => {
  const { question, options, correctOptionId } =
    getMultipleChoiceQuestionForVariantMrjt(variant, variant.presets[0].id);
  return [
    question,
    "",
    ...options.map(
      (option) =>
        `- ${option.id === correctOptionId ? "✅" : "❌"} ${option.text}`,
    ),
  ].join("\n");
};
