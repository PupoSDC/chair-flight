import type { QuestionTemplate } from "./question-template.ts";

export const getQuestionPreviewForVariantMultipleCorrect = (
  variant: Extract<QuestionTemplate, { type: "multiple-correct" }>,
) =>
  [
    variant.question,
    "",
    ...variant.options.map(
      (option) => `- ${option.correct ? "✅" : "❌"} ${option.text}`,
    ),
  ].join("\n");
