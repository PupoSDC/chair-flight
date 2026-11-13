import { getRandomGenerator } from "../../base/get-random-generator.ts";
import { getRandomId } from "../../base/get-random-id.ts";
import { getRandomShuffler } from "../../base/get-random-shuffler.ts";
import type { QuestionVariant } from "../question-bank/question-variant.ts";
import type { Test } from "./test.ts";

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

const createQuestionBody = (
  variant: QuestionVariant,
  seed: string,
): Pick<
  Test["questions"][number],
  "question" | "correctOptionId" | "options"
> => {
  const shuffle = getRandomShuffler(seed);
  const random = getRandomGenerator(seed);

  switch (variant.type) {
    case "simple": {
      const options = shuffle(variant.options);
      const correctOption = options.find((option) => option.correct);
      const wrongOptions = options.filter((option) => !option.correct);
      if (!correctOption) throw new Error("Question has no correct option.");
      return {
        question: variant.question,
        correctOptionId: correctOption.id,
        options: shuffle([correctOption, ...wrongOptions.slice(0, 3)]).map(
          ({ id, text, why }) => ({ id, text, why }),
        ),
      };
    }
    case "true-or-false":
      return {
        question: variant.question,
        correctOptionId: variant.answer ? "true" : "false",
        options: [
          { id: "true", text: "True", why: "" },
          { id: "false", text: "False", why: "" },
        ],
      };
    case "one-two": {
      const first = random() < 0.5;
      const second = random() < 0.5;
      const firstStatement = shuffle(
        first
          ? variant.firstCorrectStatements
          : variant.firstIncorrectStatements,
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
    }
    case "definition": {
      const [correctOption, ...otherOptions] = shuffle(variant.options);
      const wrongOptions = shuffle([
        ...otherOptions.map((option) => ({
          id: option.id,
          text: option.definition,
          why: `Correct definition for "${option.term}".`,
        })),
        ...variant.fakeOptions.map((option) => ({
          id: option.id,
          text: option.definition,
          why: "This definition does not match any term in this question.",
        })),
      ]).slice(0, 3);
      return {
        question: variant.question.replace("{term}", correctOption.term),
        correctOptionId: correctOption.id,
        options: shuffle([
          { id: correctOption.id, text: correctOption.definition, why: "" },
          ...wrongOptions,
        ]),
      };
    }
    case "multiple-correct":
      throw new Error("Multiple correct questions are not supported yet.");
  }
};

export const createTestQuestion = (
  template: {
    id: string;
    annexes: string[];
    explanation: string;
    variant: QuestionVariant;
  },
  seed: string,
): Test["questions"][number] => {
  return {
    questionId: getRandomId(getRandomGenerator(`${seed}-id`)),
    templateId: template.id,
    seed,
    annexes: template.annexes,
    explanation: template.explanation,
    ...createQuestionBody(template.variant, seed),
  };
};
