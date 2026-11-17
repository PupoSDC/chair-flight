import { getRandomGenerator } from "../../base/get-random-generator.ts";
import { getRandomId } from "../../base/get-random-id.ts";
import { getMultipleChoiceQuestion } from "../question-templates/get-multiple-choice-question.ts";
import type { QuestionTemplate } from "../question-templates/question-template.ts";
import type { Test } from "./test.ts";

export const createTestQuestion = (
  template: {
    id: string;
    annexes: string[];
    template: QuestionTemplate;
  },
  seed: string,
): Test["questions"][number] => {
  const {
    annexFields,
    explanationAnnexFields,
    annexes: generatedAnnexes = [],
    ...question
  } = getMultipleChoiceQuestion(template.template, seed);
  const explanation = question.explanation ?? template.template.explanation;
  const [fillableAnnex] = template.annexes;
  const completedAnnex =
    explanationAnnexFields && fillableAnnex
      ? `${fillableAnnex}?${new URLSearchParams({
          ...explanationAnnexFields,
          solved: Object.keys(explanationAnnexFields)
            .filter((name) => !(name in (annexFields ?? {})))
            .join(","),
        })}`
      : undefined;
  return {
    questionId: getRandomId(getRandomGenerator(`${seed}-id`)),
    templateId: template.id,
    seed,
    ...question,
    annexes: [
      ...template.annexes.map((href) =>
        annexFields ? `${href}?${new URLSearchParams(annexFields)}` : href,
      ),
      ...generatedAnnexes,
    ],
    explanation: completedAnnex
      ? `![Completed sheet](${completedAnnex})\n\n${explanation}`
      : explanation,
  };
};
