import { getRandomGenerator } from "../../base/get-random-generator.ts";
import { getRandomId } from "../../base/get-random-id.ts";
import { getRandomShuffler } from "../../base/get-random-shuffler.ts";
import type { QuestionTemplate } from "./question-template.ts";

const MULTIPLE_CORRECT_STATEMENTS = 4;

const formatNumbers = (numbers: number[]) =>
  numbers.length < 2
    ? numbers.join("")
    : `${numbers.slice(0, -1).join(", ")} and ${numbers.at(-1)}`;

const getSubsets = (size: number) =>
  Array.from({ length: 2 ** size - 1 }, (_, index) =>
    Array.from({ length: size }, (_, bit) => bit + 1).filter(
      (bit) => ((index + 1) >> (bit - 1)) & 1,
    ),
  );

export const getMultipleChoiceQuestionForVariantMultipleCorrect = (
  variant: Extract<QuestionTemplate, { type: "multiple-correct" }>,
  seed: string,
) => {
  const shuffle = getRandomShuffler(seed);
  const random = getRandomGenerator(seed);
  const shuffled = shuffle(variant.options);
  const correct = shuffled.filter((option) => option.correct);
  const incorrect = shuffled.filter((option) => !option.correct);
  if (correct.length === 0) throw new Error("Question has no correct option.");
  const required = [correct[0], incorrect[0]].filter((option) => option);
  const rest = shuffled.filter((option) => !required.includes(option));
  const statements = shuffle([
    ...required,
    ...rest.slice(0, MULTIPLE_CORRECT_STATEMENTS - required.length),
  ]);
  const correctNumbers = statements.flatMap((statement, index) =>
    statement.correct ? [index + 1] : [],
  );
  const distance = (numbers: number[]) =>
    statements.filter(
      (_, index) =>
        numbers.includes(index + 1) !== correctNumbers.includes(index + 1),
    ).length;
  const distractors = shuffle(
    getSubsets(statements.length).filter((numbers) => distance(numbers) > 0),
  )
    .sort((a, b) => distance(a) - distance(b))
    .slice(0, 3);
  const options = shuffle([correctNumbers, ...distractors]).map((numbers) => ({
    id: getRandomId(random),
    text: formatNumbers(numbers),
    why: "",
    correct: numbers === correctNumbers,
  }));
  return {
    question: [
      variant.question,
      ...statements.map(
        (statement, index) => `${index + 1}) ${statement.text}`,
      ),
    ].join("\n\n"),
    correctOptionId: options.find((option) => option.correct)?.id ?? "",
    options: options.map(({ id, text, why }) => ({ id, text, why })),
  };
};
