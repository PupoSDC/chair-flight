import { z } from "zod";
import { getQuestion } from "../questions/get-question";
import {
  getRandomId,
  getRandomIdGenerator,
  getRandomShuffler,
} from "../random/random";
import type {
  QuestionBankName,
  QuestionTemplate,
  Test,
} from "@chair-flight/base/types";

export type NewTestConfiguration = {
  mode: "study" | "exam";
  questionBank: QuestionBankName;
  subject: string;
  numberOfQuestions: number;
  learningObjectives: Record<string, boolean>;
  seed?: string;
  title?: string;
};

export const newTestConfigurationSchema: z.ZodType<NewTestConfiguration> = z
  .object({
    mode: z.enum(["study", "exam"]),
    questionBank: z.enum(["737", "atpl"]),
    subject: z.string(),
    learningObjectives: z.record(z.boolean()),
    numberOfQuestions: z.number().min(1).max(200),
    seed: z.string().optional(),
    title: z.string().optional(),
  })
  .refine(
    (config) => {
      const subjectLos = Object.keys(config.learningObjectives).filter((lo) =>
        lo.startsWith(config.subject),
      );
      if (!subjectLos.length) return true;

      const atLeastOneSubjectLoIsSelected = Object.entries(
        config.learningObjectives,
      ).some(([lo, selected]) => selected && lo.startsWith(config.subject));
      return atLeastOneSubjectLoIsSelected;
    },
    {
      message: "At least one chapter, or section must be selected.",
      path: ["learningObjectives"],
    },
  );

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

  const learningObjectives = Object.entries(config.learningObjectives).reduce<
    string[]
  >((acc, [lo, selected]) => {
    const safeSubject = subject === "070" ? "071" : subject;
    if (selected && lo.startsWith(safeSubject)) acc.push(lo);
    return acc;
  }, []);

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
