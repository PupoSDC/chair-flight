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
    answer?: {
      formula: string;
      unit: string;
      decimals: number;
      format?: string;
      optionText?: string;
      second?: {
        formula: string;
        unit: string;
        decimals: number;
        format?: string;
      };
    };
    distractors?: {
      id: string;
      formula: string;
      second?: string;
    }[];
    presets: {
      id: string;
      values: Record<string, number>;
      answer?: string;
      wrongAnswers?: string[];
      explanation?: string;
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
  const fillValues = (text: string) =>
    fillTemplate(text, { values: preset.values, labels });

  if (preset.answer !== undefined || !variant.answer) {
    const { answer, wrongAnswers = [], explanation } = preset;
    if (answer === undefined) {
      throw new Error(`Preset "${preset.id}" has no answer`);
    }
    return {
      question: fillValues(variant.question),
      explanation: fillValues(explanation ?? variant.explanation),
      correctOptionId: "answer",
      options: shuffle([
        { id: "answer", text: answer, why: "" },
        ...shuffle(wrongAnswers)
          .slice(0, MAX_WRONG_OPTIONS)
          .map((text, index) => ({ id: `wrong-${index + 1}`, text, why: "" })),
      ]),
    };
  }

  const answerConfig = variant.answer;
  const format = (value: number) => formatAnswerValue(value, answerConfig);

  const { second } = answerConfig;
  const formatSecond = (value: number) =>
    second ? formatAnswerValue(value, second) : "";
  const unitSuffix = answerConfig.format ? "" : ` ${answerConfig.unit}`;
  const secondUnitSuffix = second?.format ? "" : ` ${second?.unit}`;
  const getOptionText = (value: number, secondValue: number) => {
    if (!second) return `${format(value)}${unitSuffix}`;
    const firstText = `${format(value)}${unitSuffix}`;
    const secondText = `${formatSecond(secondValue)}${secondUnitSuffix}`;
    if (!answerConfig.optionText) return `${firstText}, ${secondText}`;
    return answerConfig.optionText
      .replace("{first}", firstText)
      .replace("{second}", secondText);
  };

  const answerValue = evaluateFormula(answerConfig.formula, preset.values);
  const answerSecondValue = second
    ? evaluateFormula(second.formula, preset.values)
    : 0;
  const answerText = getOptionText(answerValue, answerSecondValue);

  const allDistractors = (variant.distractors ?? []).map((distractor) => {
    const secondFormula = distractor.second ?? second?.formula ?? "";
    return {
      id: distractor.id,
      formula: distractor.formula,
      secondFormula,
      value: evaluateFormula(distractor.formula, preset.values),
      secondValue: second ? evaluateFormula(secondFormula, preset.values) : 0,
    };
  });

  const wrongOptions = allDistractors
    .filter(({ value, secondValue }) => {
      return Number.isFinite(value) && Number.isFinite(secondValue);
    })
    .filter((distractor, index, all) => {
      const text = getOptionText(distractor.value, distractor.secondValue);
      const firstIndex = all.findIndex((other) => {
        return getOptionText(other.value, other.secondValue) === text;
      });
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
      decimals: answerConfig.decimals,
      formatResult: format,
    });

  const toOption = (
    id: string,
    value: number,
    formula: string,
    secondValue: number,
    secondFormula: string,
  ) => ({
    id,
    text: getOptionText(value, secondValue),
    why: [formula, secondFormula]
      .filter(Boolean)
      .map((text) => formulaToMathMl(text, { values: preset.values }))
      .join(" "),
  });

  return {
    question: fill(variant.question),
    explanation: fill(variant.explanation),
    correctOptionId: "answer",
    options: shuffle([
      toOption(
        "answer",
        answerValue,
        answerConfig.formula,
        answerSecondValue,
        second?.formula ?? "",
      ),
      ...shuffle(wrongOptions)
        .slice(0, MAX_WRONG_OPTIONS)
        .map((wrong) =>
          toOption(
            wrong.id,
            wrong.value,
            wrong.formula,
            wrong.secondValue,
            wrong.secondFormula,
          ),
        ),
    ]),
  };
};
