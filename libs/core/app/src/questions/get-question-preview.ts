import type {
  QuestionTemplate,
  QuestionVariant,
  QuestionVariantOneTwo,
  QuestionVariantSimple,
  QuestionVariantTrueOrFalse,
} from "@chair-flight/base/types";

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

const getQuestionVariantTrueOrFalse = (
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

export const getVariantPreview = (variant: QuestionVariant) => {
  switch (variant.type) {
    case "simple":
      return getQuestionVariantSimplePreview(variant);
    case "one-two":
      return getQuestionVariantOneTwoPreview(variant);
    case "true-or-false":
      return getQuestionVariantTrueOrFalse(variant);
    case "calculation":
      return "Calculation questions are not supported yet";
  }
};

export const getQuestionPreview = (
  question: QuestionTemplate,
  variantId: string,
) => {
  const variant = question.variants[variantId];
  if (!variant) throw new Error("Variant not found");
  return getVariantPreview(variant);
};
