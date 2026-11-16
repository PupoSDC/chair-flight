import type { QuestionTemplate } from "./question-template.ts";

const formatStatements = (statements: string[], correct: boolean) =>
  statements.map((statement) => `- ${correct ? "✅" : "❌"} ${statement}`);

export const getQuestionPreviewForVariantOneTwo = (
  variant: Extract<QuestionTemplate, { type: "one-two" }>,
) =>
  [
    variant.question,
    "",
    ...formatStatements(variant.firstCorrectStatements, true),
    ...formatStatements(variant.secondCorrectStatements, true),
    ...formatStatements(variant.firstIncorrectStatements, false),
    ...formatStatements(variant.secondIncorrectStatements, false),
  ].join("\n");
