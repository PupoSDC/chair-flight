import type { QuestionTemplate } from "./question-template.ts";

export const getQuestionPreviewForVariantSimple = (
  variant: Extract<QuestionTemplate, { type: "simple" }>,
) =>
  [
    variant.question,
    "",
    ...variant.options.map(
      (option) => `- ${option.correct ? "✅" : "❌"} ${option.text}`,
    ),
  ].join("\n");
