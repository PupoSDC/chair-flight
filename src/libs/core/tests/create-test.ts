import { getRandomGenerator } from "../../base/get-random-generator.ts";
import { getRandomId } from "../../base/get-random-id.ts";
import { createTestQuestion } from "./create-test-question.ts";
import type { QuestionBankName } from "../question-bank/question-banks.ts";
import type { QuestionVariant } from "../question-bank/question-variant.ts";
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
    explanation: string;
    variant: QuestionVariant;
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
    questions: templates
      .filter((template) => template.variant.type !== "multiple-correct")
      .map((template) => createTestQuestion(template, getRandomId(random))),
  };
};
