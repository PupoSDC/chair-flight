import type { QuestionTemplate } from "./question-template.ts";

export const getQuestionPreviewForVariantDefinition = (
  variant: Extract<QuestionTemplate, { type: "definition" }>,
) =>
  [
    variant.question.replace("{term}", "______"),
    "",
    ...variant.options.map(
      (option) => `- ${option.term} → ${option.definition}`,
    ),
  ].join("\n");
