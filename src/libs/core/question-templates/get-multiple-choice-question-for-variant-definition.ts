import { getRandomShuffler } from "../../base/get-random-shuffler.ts";
import type { QuestionTemplate } from "./question-template.ts";

export const getMultipleChoiceQuestionForVariantDefinition = (
  variant: Extract<QuestionTemplate, { type: "definition" }>,
  seed: string,
) => {
  const shuffle = getRandomShuffler(seed);
  const [correctOption, ...otherOptions] = shuffle(variant.options);
  const withAnnexes = variant.options.some((option) => option.annex);
  const showOptionExplanations = variant.showOptionExplanations ?? true;
  const wrongOptions = shuffle([
    ...otherOptions.map((option) => {
      const reference = withAnnexes
        ? `image ${option.term}`
        : `"${option.term}"`;
      return {
        id: option.id,
        text: option.definition,
        why: showOptionExplanations
          ? `Correct definition for ${reference}.`
          : "",
      };
    }),
    ...variant.fakeOptions.map((option) => ({
      id: option.id,
      text: option.definition,
      why: showOptionExplanations
        ? "This definition does not match any term in this question."
        : "",
    })),
  ]).slice(0, 3);
  const table = [
    `| ${withAnnexes ? "Image" : "Term"} | Meaning |`,
    "| --- | --- |",
    ...variant.options.map(
      (option) => `| ${option.term} | ${option.definition} |`,
    ),
  ].join("\n");
  return {
    question: variant.question.replace("{term}", correctOption.term),
    correctOptionId: correctOption.id,
    options: shuffle([
      { id: correctOption.id, text: correctOption.definition, why: "" },
      ...wrongOptions,
    ]),
    explanation: variant.explanation.replace("{table}", table),
    annexes: correctOption.annex ? [correctOption.annex] : [],
  };
};
