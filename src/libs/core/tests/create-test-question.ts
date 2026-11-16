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
  return {
    questionId: getRandomId(getRandomGenerator(`${seed}-id`)),
    templateId: template.id,
    seed,
    annexes: template.annexes,
    explanation: template.template.explanation,
    ...getMultipleChoiceQuestion(template.template, seed),
  };
};
