import { z } from "zod";
import { getQuestion } from "../questions/get-question";
import { getRandomId, getRandomShuffler } from "../random/random";
import type { Test, QuestionBankRepository } from "@chair-flight/base/types";

export type NewTestConfiguration = {
  mode: "study" | "exam";
  subject: string;
  numberOfQuestions: number;
  learningObjectives: Record<string, boolean>;
  seed?: string;
  title?: string;
};

export const newTestConfigurationSchema: z.ZodType<NewTestConfiguration> =
  z.object({
    mode: z.enum(["study", "exam"]),
    subject: z.string(),
    learningObjectives: z.record(z.boolean()),
    numberOfQuestions: z.number().min(1).max(200),
    seed: z.string().optional(),
    title: z.string().optional(),
  });

export const createTest = async ({
  config,
  questionBank,
}: {
  config: NewTestConfiguration;
  questionBank: QuestionBankRepository;
}): Promise<Test> => {
  const allQuestions = await questionBank.getAllQuestionTemplates();
  const numberOfQuestions = config.numberOfQuestions ?? 40;
  const learningObjectives = config.learningObjectives;
  const title = config.title ?? `${config.subject} ${config.mode}`;
  const seed = config.seed ?? getRandomId();
  const shuffler = getRandomShuffler(seed);

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
    .map((q) => getQuestion(q, { seed }));

  return {
    id: getRandomId(),
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
