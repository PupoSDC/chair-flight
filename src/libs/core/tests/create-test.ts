import { getRandomGenerator } from "../../base/get-random-generator.ts";
import { getRandomId } from "../../base/get-random-id.ts";
import { createTestQuestion } from "./create-test-question.ts";
import type { QuestionBankName } from "../question-banks/question-banks.ts";
import type { QuestionTemplate } from "../question-templates/question-template.ts";
import type { Test } from "./test.ts";

export const createTest = ({
  questionBank,
  mode,
  title,
  seed,
  durationInMinutes,
  templates,
}: {
  questionBank: QuestionBankName;
  mode: Test["mode"];
  title: string;
  seed: string;
  durationInMinutes: number;
  templates: {
    id: string;
    annexes: string[];
    template: QuestionTemplate;
  }[];
}): Test => {
  const random = getRandomGenerator(seed);
  return {
    id: getRandomId(),
    questionBank,
    title,
    mode,
    status: "created",
    currentQuestionIndex: 0,
    timeSpentInMs: 0,
    durationInMs: durationInMinutes * 60 * 1000,
    createdAtEpochMs: Date.now(),
    startedAtEpochMs: null,
    finishedAtEpochMs: null,
    questions: templates.map((template) =>
      createTestQuestion(template, getRandomId(random)),
    ),
  };
};
