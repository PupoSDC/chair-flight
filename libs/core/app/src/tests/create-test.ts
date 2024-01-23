import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/schemas";
import { getQuestion } from "../questions/get-question";
import {
  getRandomId,
  getRandomIdGenerator,
  getRandomShuffler,
} from "../random/random";
import type {
  QuestionBankName,
  QuestionBankQuestionTemplate,
  Test,
} from "@chair-flight/base/types";

export type NewTestConfiguration = {
  mode: "study" | "exam";
  questionBank: QuestionBankName;
  subject: string;

  numberOfQuestions: number;
  learningObjectiveIds: string[];
  seed?: string;
  title?: string;
  sortQuestionsByChapter?: boolean;
};

export const newTestConfigurationSchema: z.ZodType<NewTestConfiguration> =
  z.object({
    mode: z.enum(["study", "exam"]),
    questionBank: questionBankNameSchema,
    subject: z.string(),
    learningObjectiveIds: z.string().array().min(1),
    numberOfQuestions: z.number().min(1).max(200),
    seed: z.string().optional(),
    title: z.string().optional(),
    sortQuestionsByChapter: z.boolean().optional(),
  });

export const createTest = async ({
  config,
  questions: allQuestions,
}: {
  config: NewTestConfiguration;
  questions: QuestionBankQuestionTemplate[];
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
    .map((q) => getQuestion(q, { seed: getRandomRandomId() }));

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
