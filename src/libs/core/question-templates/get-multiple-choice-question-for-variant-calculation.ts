import { getRandomGenerator } from "../../base/get-random-generator.ts";
import { getRandomShuffler } from "../../base/get-random-shuffler.ts";
import { evaluateFormula } from "../calculation/evaluate-formula.ts";
import { fillTemplate } from "../calculation/fill-template.ts";
import { formatAnswerValue } from "../calculation/format-answer-value.ts";
import { formulaToMathMl } from "../calculation/formula-to-math-ml.ts";

const MAX_WRONG_OPTIONS = 3;

export const getMultipleChoiceQuestionForVariantCalculation = (
  variant: {
    question: string;
    variables: {
      id: string;
      label: string;
      unit: string;
    }[];
    answer: {
      formula: string;
      unit: string;
      decimals: number;
      format?: string;
    };
    distractors: {
      id: string;
      formula: string;
    }[];
    presets: {
      id: string;
      values: Record<string, number>;
    }[];
    explanation: string;
  },
  seed: string,
) => {
  const random = getRandomGenerator(seed);
  const shuffle = getRandomShuffler(seed);
  const preset = variant.presets[Math.floor(random() * variant.presets.length)];
  const labels = Object.fromEntries(
    variant.variables.map(({ id, label }) => [id, label]),
  );
  const format = (value: number) => formatAnswerValue(value, variant.answer);

  const answerValue = evaluateFormula(variant.answer.formula, preset.values);
  const answerText = format(answerValue);

  const allDistractors = variant.distractors.map(({ id, formula }) => ({
    id,
    formula,
    value: evaluateFormula(formula, preset.values),
  }));

  const wrongOptions = allDistractors
    .filter(({ value }) => Number.isFinite(value))
    .filter(({ value }, index, all) => {
      const text = format(value);
      const firstIndex = all.findIndex((other) => format(other.value) === text);
      return text !== answerText && firstIndex === index;
    });

  const results = {
    answer: answerValue,
    ...Object.fromEntries(allDistractors.map(({ id, value }) => [id, value])),
  };

  const fill = (text: string) =>
    fillTemplate(text, {
      values: preset.values,
      labels,
      results,
      decimals: variant.answer.decimals,
      formatResult: format,
    });

  const unitSuffix = variant.answer.format ? "" : ` ${variant.answer.unit}`;
  const toOption = (id: string, value: number, formula: string) => ({
    id,
    text: `${format(value)}${unitSuffix}`,
    why: formulaToMathMl(formula, { values: preset.values }),
  });

  return {
    question: fill(variant.question),
    explanation: fill(variant.explanation),
    correctOptionId: "answer",
    options: shuffle([
      toOption("answer", answerValue, variant.answer.formula),
      ...shuffle(wrongOptions)
        .slice(0, MAX_WRONG_OPTIONS)
        .map(({ id, value, formula }) => toOption(id, value, formula)),
    ]),
  };
};
