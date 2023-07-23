import { z } from "zod";
import { getQuestion } from "../questions/get-question";
import { getRandomId, getRandomShuffler } from "../random/random";
import type { Test, QuestionBankRepository } from "@chair-flight/base/types";

export const newTestConfigurationSchema = z.object({
  title: z.string(),
  mode: z.enum(["study", "exam"]),
  learningObjectives: z.array(z.string()),
  numberOfQuestions: z.number().optional(),
  seed: z.string().optional(),
});

export type NewTestConfiguration = z.infer<typeof newTestConfigurationSchema>;

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
  const title = config.title;
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
