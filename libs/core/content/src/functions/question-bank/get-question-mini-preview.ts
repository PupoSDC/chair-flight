import type { QuestionVariant } from "../../entities/question-bank/question-bank-question";
import type { QuestionVariantDefinition } from "../../entities/question-bank/question-bank-question-definition";
import type { QuestionVariantMultipleCorrect } from "../../entities/question-bank/question-bank-question-multiple-correct";
import type { QuestionVariantOneTwo } from "../../entities/question-bank/question-bank-question-one-two";
import type { QuestionVariantSimple } from "../../entities/question-bank/question-bank-question-simple";
import type { QuestionVariantTrueOrFalse } from "../../entities/question-bank/question-bank-question-true-or-false";

const getQuestionVariantSimpleMiniPreview = (
  variant: QuestionVariantSimple,
): string => {
  const answer = variant.options.find((option) => option.correct)?.text;
  return `${variant.question}\nA: ${answer}`;
};

const getQuestionVariantTrueOrFalseMiniPreview = (
  variant: QuestionVariantTrueOrFalse,
): string => {
  return `${variant.question}`;
};

const getQuestionVariantOneTwoMiniPreview = (
  variant: QuestionVariantOneTwo,
): string => {
  const correctOptions = [
    ...variant.firstCorrectStatements,
    ...variant.secondCorrectStatements,
  ];

  return `${correctOptions.join("\n")}`;
};

const getQuestionVariantDefinitionPreview = (
  variant: QuestionVariantDefinition,
): string => {
  return variant.question.replace("{term}", "______");
};

const getQuestionMultipleCorrectMiniPreview = (
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

/** No markdown, simplifies version of preview */
export const getQuestionMiniPreview = (variant: QuestionVariant) => {
  switch (variant.type) {
    case "simple":
      return getQuestionVariantSimpleMiniPreview(variant);
    case "one-two":
      return getQuestionVariantOneTwoMiniPreview(variant);
    case "true-or-false":
      return getQuestionVariantTrueOrFalseMiniPreview(variant);
    case "definition":
      return getQuestionVariantDefinitionPreview(variant);
    case "multiple-correct":
      return getQuestionMultipleCorrectMiniPreview(variant);
  }
};
