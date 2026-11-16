import { getRandomGenerator } from "../../base/get-random-generator.ts";
import { getRandomShuffler } from "../../base/get-random-shuffler.ts";
import { fillTemplate } from "../calculation/fill-template.ts";

const MAX_WRONG_OPTIONS = 3;

export const getMultipleChoiceQuestionForVariantChart = (
  variant: {
    question: string;
    variables: {
      id: string;
      label: string;
      unit: string;
    }[];
    entries: {
      id: string;
      values: Record<string, number>;
      answer: string;
      wrongAnswers: string[];
      explanation: string;
    }[];
    explanation: string;
  },
  seed: string,
) => {
  const random = getRandomGenerator(seed);
  const shuffle = getRandomShuffler(seed);
  const entry = variant.entries[Math.floor(random() * variant.entries.length)];
  const labels = Object.fromEntries(
    variant.variables.map(({ id, label }) => [id, label]),
  );
  const fill = (text: string) =>
    fillTemplate(text, { values: entry.values, labels });

  return {
    question: fill(variant.question),
    explanation: fill(entry.explanation || variant.explanation),
    correctOptionId: "answer",
    options: shuffle([
      { id: "answer", text: entry.answer, why: "" },
      ...shuffle(entry.wrongAnswers)
        .slice(0, MAX_WRONG_OPTIONS)
        .map((text, index) => ({ id: `wrong-${index + 1}`, text, why: "" })),
    ]),
  };
};
