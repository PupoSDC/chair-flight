import { getRandomShuffler } from "../../base/get-random-shuffler.ts";

export const selectTestQuestionIds = ({
  questions,
  learningObjectiveIds,
  numberOfQuestions,
  seed,
}: {
  questions: {
    id: string;
    learningObjectives: string[];
  }[];
  learningObjectiveIds: string[];
  numberOfQuestions: number;
  seed: string;
}) => {
  const shuffle = getRandomShuffler(seed);
  const possibleQuestions = questions.filter((question) =>
    question.learningObjectives.some((questionLo) =>
      learningObjectiveIds.some((targetLo) => questionLo.startsWith(targetLo)),
    ),
  );
  return shuffle(possibleQuestions)
    .slice(0, numberOfQuestions)
    .map((question) => question.id);
};
