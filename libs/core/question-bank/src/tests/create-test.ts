import { z } from "zod";
import {
  getRandomId,
  getRandomIdGenerator,
  getRandomShuffler,
} from "@chair-flight/base/utils";
import { questionBankNameSchema } from "../entities/question-bank-name";
import { createTestQuestion } from "./create-test-question";
import type { QuestionTemplate } from "../entities/question-bank-question";
import type { Test } from "../entities/test-types";

export const newTestConfigurationSchema = z.object({
  mode: z.enum(["study", "exam"]),
  questionBank: questionBankNameSchema,
  subject: z.string(),
  learningObjectiveIds: z.string().array().min(1),
  numberOfQuestions: z.number().min(1).max(200),
  seed: z.string().optional(),
  title: z.string().optional(),
  sortQuestionsByChapter: z.boolean().optional(),
});

export type NewTestConfiguration = z.infer<typeof newTestConfigurationSchema>;

export const createTest = async ({
  config,
  questions: allQuestions,
}: {
  config: NewTestConfiguration;
  questions: QuestionTemplate[];
}): Promise<Test> => {
  const numberOfQuestions = config.numberOfQuestions ?? 40;
  const subject = config.subject;
  const mode = config.mode;
  const title = config.title ?? `${subject} ${mode}`;
  const seed = config.seed ?? getRandomId();
  const shuffler = getRandomShuffler(seed);
  const getRandomRandomId = getRandomIdGenerator(seed);

  const learningObjectives = config.learningObjectiveIds;

  const possibleQuestions = Object.values(allQuestions).filter((q) => {
    const hasLearningObjectives = q.learningObjectives.some((questionLo) => {
      return learningObjectives.some((targetLo) =>
        questionLo.startsWith(targetLo),
      );
    });

    return hasLearningObjectives;
  });

  const questions = shuffler(possibleQuestions)
    .slice(0, numberOfQuestions)
    .map((q) => createTestQuestion(q, { seed: getRandomRandomId() }));

  return {
    id: getRandomId(),
    questionBank: config.questionBank,
    title: title,
    status: "created",
    mode: config.mode,
    currentQuestionIndex: 0,
    timeSpentInMs: 0,
    durationInMs: 40 * 60 * 1000,
    questions,
    createdAtEpochMs: Date.now(),
    startedAtEpochMs: null,
    finishedAtEpochMs: null,
  };
};
