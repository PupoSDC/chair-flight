import { getRandomGenerator } from "../../base/get-random-generator.ts";
import { getRandomId } from "../../base/get-random-id.ts";
import { getRandomShuffler } from "../../base/get-random-shuffler.ts";
import type { QuestionTemplate } from "./question-template.ts";

const ONE_TWO_OPTIONS = [
  {
    text: "One is correct, two is correct",
    first: true,
    second: true,
  },
  {
    text: "One is correct, two is incorrect",
    first: true,
    second: false,
  },
  {
    text: "One is incorrect, two is correct",
    first: false,
    second: true,
  },
  {
    text: "One is incorrect, two is incorrect",
    first: false,
    second: false,
  },
];

export const getMultipleChoiceQuestionForVariantOneTwo = (
  variant: Extract<QuestionTemplate, { type: "one-two" }>,
  seed: string,
) => {
  const shuffle = getRandomShuffler(seed);
  const random = getRandomGenerator(seed);
  const canBeTrue = (correct: string[], incorrect: string[]) =>
    correct.length > 0 && (incorrect.length === 0 || random() < 0.5);
  const first = canBeTrue(
    variant.firstCorrectStatements,
    variant.firstIncorrectStatements,
  );
  const second = canBeTrue(
    variant.secondCorrectStatements,
    variant.secondIncorrectStatements,
  );
  const firstStatement = shuffle(
    first ? variant.firstCorrectStatements : variant.firstIncorrectStatements,
  )[0];
  const secondStatement = shuffle(
    second
      ? variant.secondCorrectStatements
      : variant.secondIncorrectStatements,
  )[0];
  const options = shuffle(ONE_TWO_OPTIONS).map((option) => ({
    id: getRandomId(random),
    text: option.text,
    why: "",
    correct: option.first === first && option.second === second,
  }));
  return {
    question: [
      variant.question,
      `1) ${firstStatement}`,
      `2) ${secondStatement}`,
    ].join("\n\n"),
    correctOptionId: options.find((option) => option.correct)?.id ?? "",
    options: options.map(({ id, text, why }) => ({ id, text, why })),
  };
};
