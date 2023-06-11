import { compress, decompress } from "shrink-string";
import { NotFoundError } from "@chair-flight/base/errors";
import { getRedis } from "@chair-flight/external/upstash";
import type {
  FlashCardContent,
  LearningObjective,
  LearningObjectiveId,
  LearningObjectiveSummary,
  QuestionBankRepository,
  QuestionTemplate,
  QuestionTemplateId,
} from "@chair-flight/base/types";
import type { Redis } from "@chair-flight/external/upstash";

const COMPRESS_QUESTION_BLOCKS_NUMBER = 10;
const QUESTION_COMPRESSED = "question-compressed-";
const QUESTION = "question-";
const LEARNING_OBJECTIVE_LIST = "learning-objective-list";
const LEARNING_OBJECTIVE = "learning-objective-";
const SUBJECTS = "subjects";
const FLASH_CARDS = "flash-cards";

type FlashCardsMap = Record<string, FlashCardContent[]>;

export class QuestionBankRedisRepository implements QuestionBankRepository {
  private redis: Redis;
  private allQuestionTemplates: QuestionTemplate[] = [];
  private allLearningObjectives: LearningObjective[] = [];
  private allQuestionTemplatesMap: Record<string, QuestionTemplate> = {};
  private allLearningObjectivesMap: Record<string, LearningObjective> = {};
  private allFlashCards: FlashCardsMap = {};
  private subjects: LearningObjectiveSummary[] = [];

  constructor() {
    this.redis = getRedis();
  }

  private chunk = <T>(arr: T[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );

  async getAllQuestionTemplates() {
    if (!this.allQuestionTemplates.length) {
      this.allQuestionTemplates = (
        await Promise.all(
          new Array(COMPRESS_QUESTION_BLOCKS_NUMBER)
            .fill(0)
            .map(async (_, i) => {
              const compressedQuestions = await this.redis.get(
                `${QUESTION_COMPRESSED}${i}`
              );
              const string = await decompress(compressedQuestions as string);
              return JSON.parse(string) as QuestionTemplate[];
            })
        )
      ).flat();
      this.allQuestionTemplatesMap = this.allQuestionTemplates.reduce<
        Record<string, QuestionTemplate>
      >((sum, question) => {
        sum[question.id] = question;
        return sum;
      }, {});
    }
    return this.allQuestionTemplates;
  }

  async getQuestionTemplate(questionId: string): Promise<QuestionTemplate> {
    return (
      this.allQuestionTemplatesMap[questionId] ??
      (this.redis.get(`${QUESTION}${questionId}`) as Promise<QuestionTemplate>)
    );
  }

  async getQuestionTemplates(
    questionIds: string[]
  ): Promise<QuestionTemplate[]> {
    if (!this.allQuestionTemplates.length) {
      return this.redis.mget<QuestionTemplate[]>(
        ...questionIds.map((id) => `${QUESTION}${id}`)
      );
    }
    return this.allQuestionTemplates.filter((q) => questionIds.includes(q.id));
  }

  async getAllLearningObjectives() {
    if (!this.allLearningObjectives.length) {
      const learningObjectivesList = (await this.redis.get(
        LEARNING_OBJECTIVE_LIST
      )) as string;
      const learningObjectiveIds = learningObjectivesList
        .split(",")
        .map((id) => `${LEARNING_OBJECTIVE}${id}`);
      const chunks = this.chunk(learningObjectiveIds, 800);
      this.allLearningObjectives = (
        await Promise.all(
          chunks.map(
            (chunk) => this.redis.mget(...chunk) as Promise<LearningObjective[]>
          )
        )
      ).flat();
      this.allLearningObjectivesMap = this.allLearningObjectives.reduce<
        Record<string, LearningObjective>
      >((sum, lo) => {
        sum[lo.id] = lo;
        return sum;
      }, {});
    }
    return this.allLearningObjectives;
  }

  async getLearningObjective(id: string) {
    return (
      this.allLearningObjectivesMap[id] ??
      (this.redis.get(
        `${LEARNING_OBJECTIVE}${id}`
      ) as Promise<LearningObjective>)
    );
  }

  async getLearningObjectives(ids: string[]) {
    return (
      this.allLearningObjectives.filter((lo) => ids.includes(lo.id)) ??
      (this.redis.mget(
        ...ids.map((id) => `${LEARNING_OBJECTIVE}${id}`)
      ) as Promise<LearningObjective[]>)
    );
  }

  async getAllSubjects() {
    if (!this.subjects.length) {
      const subjects = await this.redis.get<LearningObjectiveSummary[]>(
        SUBJECTS
      );
      if (!subjects) throw new NotFoundError("Subjects not found");
      this.subjects = subjects;
    }
    return this.subjects;
  }

  async getAllFlashCards() {
    if (!Object.values(this.allFlashCards).length) {
      const flashCards = await this.redis.get<FlashCardsMap>(FLASH_CARDS);
      if (!flashCards) throw new NotFoundError("Flash cards not found");
      this.allFlashCards = flashCards;
    }
    return this.allFlashCards;
  }

  async writeQuestions(questions: QuestionTemplate[]) {
    const questionBlocks = this.chunk(questions, 800);
    let completedEntries = 0;

    await Promise.all(
      questionBlocks.map(async (block) => {
        await this.redis.mset(
          block.reduce<Record<QuestionTemplateId, QuestionTemplate>>(
            (sum, question) => {
              sum[`${QUESTION}${question.id}`] = question;
              return sum;
            },
            {}
          )
        );
        completedEntries += block.length;
        console.log(
          `Migrated questions ${completedEntries}/${questions.length}`
        );
      })
    );

    const questionBlocks2 = this.chunk(
      questions,
      Math.ceil(questions.length / COMPRESS_QUESTION_BLOCKS_NUMBER)
    );

    let completedEntries2 = 0;
    await Promise.all(
      questionBlocks2.map(async (block, i) => {
        const textBlock = await compress(JSON.stringify(block));
        await this.redis.set(`${QUESTION_COMPRESSED}${i}`, textBlock);
        completedEntries2 += 1;
        console.log(
          `Migrated questions blocks ${completedEntries2}/${questionBlocks2.length}`
        );
      })
    );
  }

  async writeLearningObjectives(learningObjectives: LearningObjective[]) {
    const loBlocks = this.chunk(learningObjectives, 800);
    let completedEntries = 0;
    await Promise.all(
      loBlocks.map(async (block) => {
        await this.redis.mset(
          block.reduce<Record<LearningObjectiveId, LearningObjective>>(
            (sum, lo) => {
              sum[`${LEARNING_OBJECTIVE}${lo.id}`] = lo;
              return sum;
            },
            {}
          )
        );
        completedEntries += block.length;
        console.log(
          `Migrated learning Objectives ${completedEntries}/${learningObjectives.length}`
        );
      })
    );
    const learningObjectiveList = learningObjectives.map((q) => q.id).join(",");
    await this.redis.set(LEARNING_OBJECTIVE_LIST, learningObjectiveList);
  }

  async writeSubjects(subjects: LearningObjectiveSummary[]) {
    await this.redis.set(SUBJECTS, subjects);
  }

  async writeFlashCards(
    flashCards: Record<string, FlashCardContent[]>
  ): Promise<void> {
    await this.redis.set(FLASH_CARDS, flashCards);
    console.log(`Migrated Flash Cards`);
  }
}
