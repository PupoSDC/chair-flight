import { BadQuestionError } from "@chair-flight/base/errors";
import {
  getRandomId,
  getRandomIdGenerator,
  getRandomShuffler,
} from "../random/random";
import type {
  Question,
  QuestionMultipleChoice,
  QuestionTemplate,
  QuestionType,
  QuestionVariantCalculation,
  QuestionVariantOneTwo,
  QuestionVariantSimple,
} from "@chair-flight/base/types";

const getQuestionMultipleChoiceFromSimple = ({
  template,
  variant,
  randomSeed,
}: {
  template: QuestionTemplate;
  variant: QuestionVariantSimple;
  randomSeed: string;
}): QuestionMultipleChoice => {
  const shuffler = getRandomShuffler(randomSeed);
  const options = shuffler(variant.options);
  const correctOption = options.find((option) => option.correct);
  const wrongOptions = options.filter((option) => !option.correct).slice(0, 3);

  if (!correctOption) {
    throw new BadQuestionError(template, {
      message: "No correct option found",
      variantId: variant.id,
      options,
    });
  }

  if (wrongOptions.length < 3) {
    throw new BadQuestionError(template, {
      message: "Not enough wrong options found",
      variantId: variant.id,
      options,
    });
  }

  return {
    questionId: getRandomId(),
    templateId: template.id,
    variantId: variant.id,
    seed: randomSeed,
    type: "multiple-choice",
    question: variant.question,
    annexes: variant.annexes,
    correctOptionId: correctOption.id,
    options: shuffler([correctOption, ...wrongOptions]),
    explanation: [variant.explanation, template.explanation]
      .filter(Boolean)
      .join("\n\n---\n\n"),
  };
};

const getQuestionMultipleChoiceFromOneTwo = ({
  template,
  variant,
  randomSeed,
}: {
  template: QuestionTemplate;
  variant: QuestionVariantOneTwo;
  randomSeed: string;
}): QuestionMultipleChoice => {
  const shuffle = getRandomShuffler(randomSeed);
  const getRandomId = getRandomIdGenerator(randomSeed);
  const {
    firstCorrectStatements,
    secondCorrectStatements,
    firstIncorrectStatements,
    secondIncorrectStatements,
    question: questionPrelude,
  } = variant;

  const isFirstCorrect = shuffle([true, false])[0];
  const isSecondCorrect = shuffle([true, false])[0];
  const questionText = [
    questionPrelude,
    `1) ${
      shuffle(
        isFirstCorrect ? firstCorrectStatements : firstIncorrectStatements,
      )[0]
    }`,
    `2) ${
      shuffle(
        isSecondCorrect ? secondCorrectStatements : secondIncorrectStatements,
      )[0]
    }`,
  ].join("\n\n");

  const oneCorrectTwoCorrect = "One is correct, two is correct";
  const oneCorrectTwoIncorrect = "One is correct, two is incorrect";
  const oneIncorrectTwoCorrect = "One is incorrect, two is correct";
  const oneIncorrectTwoIncorrect = "One is incorrect, two is incorrect";

  const options = shuffle([
    {
      text: oneCorrectTwoCorrect,
      correct: isFirstCorrect && isSecondCorrect,
      why: "",
      id: getRandomId(),
    },
    {
      text: oneCorrectTwoIncorrect,
      correct: isFirstCorrect && !isSecondCorrect,
      why: "",
      id: getRandomId(),
    },
    {
      text: oneIncorrectTwoCorrect,
      correct: !isFirstCorrect && isSecondCorrect,
      why: "",
      id: getRandomId(),
    },
    {
      text: oneIncorrectTwoIncorrect,
      correct: !isFirstCorrect && !isSecondCorrect,
      why: "",
      id: getRandomId(),
    },
  ]);

  return {
    questionId: getRandomId(),
    templateId: template.id,
    variantId: variant.id,
    seed: randomSeed,
    type: "multiple-choice",
    question: questionText,
    annexes: [],
    correctOptionId: options.find((option) => option.correct)?.id ?? "",
    options,
    explanation: [variant.explanation, template.explanation]
      .filter(Boolean)
      .join("\n\n---\n\n"),
  };
};

const getQuestionMultipleChoiceFromCalculation = ({
  template,
  variant,
  randomSeed,
}: {
  template: QuestionTemplate;
  variant: QuestionVariantCalculation;
  randomSeed: string;
}): QuestionMultipleChoice => {
  return {
    questionId: getRandomId(),
    templateId: template.id,
    variantId: variant.id,
    seed: randomSeed,
    type: "multiple-choice",
    question: "",
    options: [],
    annexes: [],
    correctOptionId: "",
    explanation: [variant.explanation, template.explanation]
      .filter(Boolean)
      .join("\n\n---\n\n"),
  };
};

export const getQuestion = (
  template: QuestionTemplate,
  options: {
    variantId?: string;
    seed?: string;
    type?: QuestionType;
  },
): Question => {
  const { variantId, seed } = options;
  const randomSeed = seed ?? getRandomId();
  const shuffler = getRandomShuffler(randomSeed);
  const variant = variantId
    ? template.variants[variantId]
    : template.variants[shuffler(Object.keys(template.variants))[0]];

  if (!variant) throw new BadQuestionError(template, options);

  switch (variant.type) {
    case "simple":
      return getQuestionMultipleChoiceFromSimple({
        template: template,
        variant,
        randomSeed,
      });
    case "one-two":
      return getQuestionMultipleChoiceFromOneTwo({
        template: template,
        variant,
        randomSeed,
      });
    case "calculation":
      return getQuestionMultipleChoiceFromCalculation({
        template: template,
        variant,
        randomSeed,
      });
  }
};
