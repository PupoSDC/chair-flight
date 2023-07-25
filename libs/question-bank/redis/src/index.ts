import { NotFoundError } from "@chair-flight/base/errors";
import { getRedis } from "@chair-flight/external/upstash";
import type {
  FlashCardContent,
  LearningObjective,
  LearningObjectiveId,
  LearningObjectiveSummary,
  QuestionTemplate,
  QuestionTemplateId,
} from "@chair-flight/base/types";

type FlashCardsMap = Record<string, FlashCardContent[]>;

const redis = getRedis();
const QUESTION = "QB-READ-ONLY-QUESTION-";
const LEARNING_OBJECTIVE = "QB-READ-ONLY-LEARNING-OBJECTIVE-";
const SUBJECTS = "QB-READ-ONLY-SUBJECTS";
const FLASH_CARDS = "QB-READ-ONLY-FLASH-CARDS";

let allQuestionTemplates: QuestionTemplate[] = [];
let allLearningObjectives: LearningObjective[] = [];
let allQuestionTemplatesMap: Record<string, QuestionTemplate> = {};
let allLearningObjectivesMap: Record<string, LearningObjective> = {};
let allFlashCards: FlashCardsMap = {};
const allSubjects: LearningObjectiveSummary[] = [];

const chunk = <T>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );

export const writeQuestionsToRedis = async (
  questions: QuestionTemplate[],
): Promise<void> => {
  const questionBlocks = chunk(questions, 200);
  let completedEntries = 0;

  await Promise.all(
    questionBlocks.map(async (block) => {
      await redis.mset(
        block.reduce<Record<QuestionTemplateId, QuestionTemplate>>(
          (sum, question) => {
            sum[`${QUESTION}${question.id}`] = question;
            return sum;
          },
          {},
        ),
      );
      completedEntries += block.length;
      console.info(
        `Migrated questions ${completedEntries}/${questions.length}`,
      );
    }),
  );
};

export const writeLearningObjectivesToRedis = async (
  learningObjectives: LearningObjective[],
): Promise<void> => {
  const loBlocks = chunk(learningObjectives, 800);
  let completedEntries = 0;

  await Promise.all(
    loBlocks.map(async (block) => {
      await redis.mset(
        block.reduce<Record<LearningObjectiveId, LearningObjective>>(
          (sum, lo) => {
            sum[`${LEARNING_OBJECTIVE}${lo.id}`] = lo;
            return sum;
          },
          {},
        ),
      );
      completedEntries += block.length;
      console.info(
        `Migrated learning Objectives ${completedEntries}/${learningObjectives.length}`,
      );
    }),
  );
};

export const writeSubjectsToRedis = async (
  subjects: LearningObjectiveSummary[],
) => {
  await redis.set(SUBJECTS, subjects);
  console.info(`Migrated Subjects`);
};

export const writeFlashCardsToRedis = async (
  flashCards: Record<string, FlashCardContent[]>,
): Promise<void> => {
  await redis.set(FLASH_CARDS, flashCards);
  console.info(`Migrated Flash Cards`);
};

export const getAllQuestionsFromRedis = async (): Promise<
  QuestionTemplate[]
> => {
  if (allQuestionTemplates.length) return allQuestionTemplates;

  let cursor = 0;
  const keys: string[] = [];
  do {
    const [count, newKeys] = await redis.scan(cursor, {
      match: `${QUESTION}*`,
      count: 20000,
    });
    cursor = count;
    keys.push(...newKeys);
  } while (cursor !== 0);

  const keysBlocks = chunk(keys, 200);
  const answer = (
    await Promise.all(
      keysBlocks.map(async (block) => redis.mget<QuestionTemplate[]>(...block)),
    )
  ).flat();

  allQuestionTemplates = answer;
  allQuestionTemplatesMap = answer.reduce<Record<string, QuestionTemplate>>(
    (sum, question) => {
      sum[question.id] = question;
      return sum;
    },
    {},
  );
  return allQuestionTemplates;
};

export const getAllQuestionsMapFromRedis = async (): Promise<
  Record<string, QuestionTemplate>
> => {
  if (!Object.keys(allQuestionTemplatesMap).length) {
    await getAllQuestionsFromRedis();
  }
  return allQuestionTemplatesMap;
};

export const getQuestionsFromRedis = async (
  questionIds: QuestionTemplateId[],
): Promise<QuestionTemplate[]> => {
  if (Object.keys(allQuestionTemplatesMap).length) {
    return questionIds.map((id) => {
      if (allQuestionTemplatesMap[id]) {
        return allQuestionTemplatesMap[id];
      }
      throw new NotFoundError(`Question ${id} not found`);
    });
  }
  const keys = questionIds.map((id) => `${QUESTION}${id}`);
  const questions = await redis.mget<QuestionTemplate[]>(...keys);
  return questions;
};

export const getAllLearningObjectivesFromRedis = async (): Promise<
  LearningObjective[]
> => {
  if (allLearningObjectives.length) return allLearningObjectives;

  let cursor = 0;
  const keys: string[] = [];
  do {
    const [count, newKeys] = await redis.scan(cursor, {
      match: `${LEARNING_OBJECTIVE}*`,
      count: 20000,
    });
    cursor = count;
    keys.push(...newKeys);
  } while (cursor !== 0);

  const keysBlocks = chunk(keys, 200);
  const answer = (
    await Promise.all(
      keysBlocks.map(async (block) =>
        redis.mget<LearningObjective[]>(...block),
      ),
    )
  ).flat();

  allLearningObjectives = answer;
  allLearningObjectivesMap = answer.reduce<Record<string, LearningObjective>>(
    (sum, lo) => {
      sum[lo.id] = lo;
      return sum;
    },
    {},
  );
  return allLearningObjectives;
};

export const getAllLearningObjectivesMapFromRedis = async (): Promise<
  Record<string, LearningObjective>
> => {
  if (!Object.keys(allLearningObjectivesMap).length) {
    await getAllLearningObjectivesFromRedis();
  }
  return allLearningObjectivesMap;
};

export const getLearningObjectivesFromRedis = async (
  learningObjectiveIds: LearningObjectiveId[],
): Promise<LearningObjective[]> => {
  if (Object.keys(allLearningObjectivesMap).length) {
    return learningObjectiveIds.map((id) => {
      if (allLearningObjectivesMap[id]) {
        return allLearningObjectivesMap[id];
      }
      throw new NotFoundError(`Learning Objective ${id} not found`);
    });
  }
  const keys = learningObjectiveIds.map((id) => `${LEARNING_OBJECTIVE}${id}`);
  const learningObjectives = await redis.mget<LearningObjective[]>(...keys);
  return learningObjectives;
};

export const getAllSubjectsFromRedis = async (): Promise<
  LearningObjectiveSummary[]
> => {
  if (allSubjects.length) return allSubjects;
  const newSubjects = await redis.get<LearningObjectiveSummary[]>(SUBJECTS);
  if (!newSubjects) throw new NotFoundError("Subjects not found");
  return allSubjects;
};

export const getAllFlashCardsFromRedis = async (): Promise<FlashCardsMap> => {
  if (Object.keys(allFlashCards).length) return allFlashCards;
  const newFlashCards = await redis.get<FlashCardsMap>(FLASH_CARDS);
  if (!newFlashCards) throw new NotFoundError("Flash cards not found");
  allFlashCards = newFlashCards;
  return allFlashCards;
};
