import type { QuestionTemplate } from "./question-template.ts";

export const getMultipleChoiceQuestionForVariantTrueOrFalse = (
  variant: Extract<QuestionTemplate, { type: "true-or-false" }>,
) => ({
  question: variant.question,
  correctOptionId: variant.answer ? "true" : "false",
  options: [
    { id: "true", text: "True", why: "" },
    { id: "false", text: "False", why: "" },
  ],
});
