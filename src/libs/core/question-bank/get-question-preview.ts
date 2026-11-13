import type { QuestionVariant } from "./question-variant.ts";

const formatStatements = (statements: string[], correct: boolean) =>
  statements.map((statement) => `- ${correct ? "✅" : "❌"} ${statement}`);

export const getQuestionPreview = (variant: QuestionVariant) => {
  switch (variant.type) {
    case "simple":
    case "multiple-correct":
      return [
        variant.question,
        "",
        ...variant.options.map(
          (option) => `- ${option.correct ? "✅" : "❌"} ${option.text}`,
        ),
      ].join("\n");
    case "true-or-false":
      return `${variant.question}\n\n${variant.answer ? "✅ True" : "❌ False"}`;
    case "one-two":
      return [
        variant.question,
        "",
        ...formatStatements(variant.firstCorrectStatements, true),
        ...formatStatements(variant.secondCorrectStatements, true),
        ...formatStatements(variant.firstIncorrectStatements, false),
        ...formatStatements(variant.secondIncorrectStatements, false),
      ].join("\n");
    case "definition":
      return [
        variant.question.replace("{term}", "______"),
        "",
        ...variant.options.map(
          (option) => `- ${option.term} → ${option.definition}`,
        ),
      ].join("\n");
  }
};
