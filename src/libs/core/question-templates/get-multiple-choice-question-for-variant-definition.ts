import { getRandomShuffler } from "../../base/get-random-shuffler.ts";
import type { QuestionTemplate } from "./question-template.ts";

export const getMultipleChoiceQuestionForVariantDefinition = (
  variant: Extract<QuestionTemplate, { type: "definition" }>,
  seed: string,
) => {
  const shuffle = getRandomShuffler(seed);
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
};
