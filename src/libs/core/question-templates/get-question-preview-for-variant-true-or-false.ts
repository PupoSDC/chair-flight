import type { QuestionTemplate } from "./question-template.ts";

export const getQuestionPreviewForVariantTrueOrFalse = (
  variant: Extract<QuestionTemplate, { type: "true-or-false" }>,
) => `${variant.question}\n\n${variant.answer ? "✅ True" : "❌ False"}`;
