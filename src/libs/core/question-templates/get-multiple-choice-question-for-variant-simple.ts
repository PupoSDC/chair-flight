import { getRandomShuffler } from "../../base/get-random-shuffler.ts";
import type { QuestionTemplate } from "./question-template.ts";

export const getMultipleChoiceQuestionForVariantSimple = (
  variant: Extract<QuestionTemplate, { type: "simple" }>,
  seed: string,
) => {
  const shuffle = getRandomShuffler(seed);
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
};
