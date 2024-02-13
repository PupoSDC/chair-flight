import { BadQuestionError, UnimplementedError } from "@cf/base/errors";
import {
  getRandomId,
  getRandomIdGenerator,
  getRandomShuffler,
} from "@cf/base/utils";
import type {
  TestQuestion,
  TestQuestionMultipleChoice,
  TestQuestionType,
} from "../entities/test-question";
import type { QuestionTemplate } from "@cf/core/question-bank";
import type { QuestionVariantDefinition } from "@cf/core/question-bank";
import type { QuestionVariantMultipleCorrect } from "@cf/core/question-bank";
import type { QuestionVariantOneTwo } from "@cf/core/question-bank";
import type { QuestionVariantSimple } from "@cf/core/question-bank";
import type { QuestionVariantTrueOrFalse } from "@cf/core/question-bank";

const createQuestionMultipleChoiceFromSimple = ({
  template,
  variant,
  randomSeed,
}: {
  template: QuestionTemplate;
  variant: QuestionVariantSimple;
  randomSeed: string;
}): TestQuestionMultipleChoice => {
  const shuffler = getRandomShuffler(randomSeed);
  const options = shuffler(variant.options);
  const correctOption = options.find((option) => option.correct);
  const wrongOptions = options.filter((option) => !option.correct).slice(0, 3);

  if (!correctOption) {
    throw new BadQuestionError(template, {
      message: "No correct option found",
    });
  }

  if (wrongOptions.length < 3) {
    throw new BadQuestionError(template, {
      message: "Not enough wrong options found",
    });
  }

  return {
    questionId: getRandomId(),
    templateId: template.id,
    seed: randomSeed,
    type: "multiple-choice",
    question: variant.question,
    annexes: template.annexes,
    correctOptionId: correctOption.id,
    options: shuffler([correctOption, ...wrongOptions]).map((opt) => ({
      id: opt.id,
      text: opt.text,
      why: opt.why,
    })),
    explanation: template.explanation,
  };
};

const createQuestionMultipleChoiceFromDefinition = ({
  template,
  variant,
  randomSeed,
}: {
  template: QuestionTemplate;
  variant: QuestionVariantDefinition;
  randomSeed: string;
}): TestQuestionMultipleChoice => {
  const shuffler = getRandomShuffler(randomSeed);
  const options = shuffler(variant.options);
  const fakeOptions = shuffler(variant.fakeOptions);

  const correctOption = {
    id: options[0].id,
    text: options[0].definition,
    why: ``,
  };

  const wrongOptions = [
    ...options
      .filter((option) => option.id !== correctOption.id)
      .map((opt) => ({
        id: opt.id,
        text: opt.definition,
        why: `Correct definition for "${opt.term}".`,
      })),
    ...fakeOptions.map((opt) => ({
      id: opt.id,
      text: opt.definition,
      why: `This definition does not match any term in this question.`,
    })),
  ];

  const autoExplanation = [
    "| Term | Definition |",
    "|------|------------|",
    ...variant.options
      .map((opt) => `| ${opt.term} | ${opt.definition}`)
      .join("\n"),
  ];

  if (!correctOption) {
    throw new BadQuestionError(template, {
      message: "No correct option found",
    });
  }

  if (wrongOptions.length < 3) {
    throw new BadQuestionError(template, {
      message: "Not enough wrong options found",
    });
  }

  return {
    questionId: getRandomId(),
    templateId: template.id,
    seed: randomSeed,
    type: "multiple-choice",
    question: variant.question,
    annexes: template.annexes,
    correctOptionId: correctOption.id,
    options: shuffler([correctOption, ...wrongOptions]),
    explanation: [autoExplanation, template.explanation]
      .filter(Boolean)
      .join("\n\n---\n\n"),
  };
};

const createQuestionMultipleChoiceFromMultipleCorrect = (args: {
  template: QuestionTemplate;
  variant: QuestionVariantMultipleCorrect;
  randomSeed: string;
}): TestQuestionMultipleChoice => {
  console.info(args);
  throw new UnimplementedError();
};

const createQuestionMultipleChoiceFromTrueOrFalse = ({
  template,
  variant,
  randomSeed,
}: {
  template: QuestionTemplate;
  variant: QuestionVariantTrueOrFalse;
  randomSeed: string;
}): TestQuestionMultipleChoice => {
  const options = [
    {
      id: "true",
      text: "True",
      why: "",
    },
    {
      id: "false",
      text: "False",
      why: "",
    },
  ];

  return {
    questionId: getRandomId(),
    templateId: template.id,
    seed: randomSeed,
    type: "multiple-choice",
    question: variant.question,
    annexes: template.annexes,
    correctOptionId: variant.answer ? "true" : "false",
    options: options,
    explanation: template.explanation,
  };
};

const createQuestionMultipleChoiceFromOneTwo = ({
  template,
  variant,
  randomSeed,
}: {
  template: QuestionTemplate;
  variant: QuestionVariantOneTwo;
  randomSeed: string;
}): TestQuestionMultipleChoice => {
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
    seed: randomSeed,
    type: "multiple-choice",
    question: questionText,
    annexes: [],
    correctOptionId: options.find((option) => option.correct)?.id ?? "",
    options: options.map((opt) => ({
      id: opt.id,
      text: opt.text,
      why: opt.why,
    })),
    explanation: template.explanation,
  };
};

export const createTestQuestion = (
  template: QuestionTemplate,
  options: {
    seed?: string;
    type?: TestQuestionType;
  },
): TestQuestion => {
  const { seed } = options;
  const randomSeed = seed ?? getRandomId();

  switch (template.variant.type) {
    case "simple":
      return createQuestionMultipleChoiceFromSimple({
        template: template,
        variant: template.variant,
        randomSeed,
      });
    case "true-or-false":
      return createQuestionMultipleChoiceFromTrueOrFalse({
        template: template,
        variant: template.variant,
        randomSeed,
      });
    case "one-two":
      return createQuestionMultipleChoiceFromOneTwo({
        template: template,
        variant: template.variant,
        randomSeed,
      });
    case "definition":
      return createQuestionMultipleChoiceFromDefinition({
        template: template,
        variant: template.variant,
        randomSeed,
      });
    case "multiple-correct":
      return createQuestionMultipleChoiceFromMultipleCorrect({
        template: template,
        variant: template.variant,
        randomSeed,
      });
  }
};
