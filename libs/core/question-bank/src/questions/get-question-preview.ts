import type { QuestionVariant } from "../entities/question-bank-question";
import type { QuestionVariantDefinition } from "../entities/question-bank-question-definition";
import type { QuestionVariantMultipleCorrect } from "../entities/question-bank-question-multiple-correct";
import type { QuestionVariantOneTwo } from "../entities/question-bank-question-one-two";
import type { QuestionVariantSimple } from "../entities/question-bank-question-simple";
import type { QuestionVariantTrueOrFalse } from "../entities/question-bank-question-true-or-false";

const getQuestionVariantSimplePreview = (
  variant: QuestionVariantSimple,
): string => {
  const options = variant.options.map((option) =>
    option.correct
      ? `- :white_check_mark: ${option.text}`
      : `- :x: ${option.text}`,
  );
  return `${variant.question}\n\n${options.join("\n")}`;
};

const getQuestionVariantTrueOrFalsePreview = (
  variant: QuestionVariantTrueOrFalse,
): string => {
  const answer = variant.answer ? ":white_check_mark: True" : ":x: False";

  return `${variant.question}\n\n${answer}`;
};

const getQuestionVariantOneTwoPreview = (
  variant: QuestionVariantOneTwo,
): string => {
  const correctOptions = [
    ...variant.firstCorrectStatements,
    ...variant.secondCorrectStatements,
  ]
    .map((statement) => `- :white_check_mark: ${statement}`)
    .join("\n");
  const wrongOptions = [
    ...variant.firstIncorrectStatements,
    ...variant.secondIncorrectStatements,
  ]
    .map((statement) => `- :x: ${statement}`)
    .join("\n");
  return `${variant.question}\n\n${correctOptions}\n${wrongOptions}`;
};

const getQuestionVariantDefinitionPreview = (
  variant: QuestionVariantDefinition,
): string => {
  return [
    variant.question,
    "\n",
    ...variant.options.map((opt) => `- ${opt.term} - ${opt.definition}`),
  ].join("\n");
};

const getQuestionMultipleCorrectPreview = (
  variant: QuestionVariantMultipleCorrect,
): string => {
  return [
    variant.question,
    "\n",
    ...variant.options.map((opt) => {
      const prefix = opt.correct ? ":white_check_mark:" : ":x:";
      return `- ${prefix} ${opt.text}`;
    }),
  ].join("\n");
};

export const getQuestionPreview = (variant: QuestionVariant) => {
  switch (variant.type) {
    case "simple":
      return getQuestionVariantSimplePreview(variant);
    case "one-two":
      return getQuestionVariantOneTwoPreview(variant);
    case "true-or-false":
      return getQuestionVariantTrueOrFalsePreview(variant);
    case "definition":
      return getQuestionVariantDefinitionPreview(variant);
    case "multiple-correct":
      return getQuestionMultipleCorrectPreview(variant);
  }
};
