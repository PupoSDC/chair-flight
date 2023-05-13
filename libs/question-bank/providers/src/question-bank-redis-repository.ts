import { compress, decompress } from "shrink-string";
import { getRedis } from "@chair-flight/external/upstash";
import { QuestionBankBaseRepository } from "./question-bank-base-repository";
import type {
  LearningObjective,
  LearningObjectiveId,
  QuestionTemplate,
  QuestionTemplateId,
} from "@chair-flight/base/types";
import type { Redis } from "@chair-flight/external/upstash";

const COMPRESS_QUESTION_BLOCKS_NUMBER = 10;

export class QuestionBankRedisRepository extends QuestionBankBaseRepository {
  private redis: Redis;

  constructor() {
    super();
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
                `questionsCompressed${i}`
              );
              const string = await decompress(compressedQuestions as string);
              return JSON.parse(string) as QuestionTemplate[];
            })
        )
      ).flat();
    }
    return this.allQuestionTemplates;
  }

  async getAllLearningObjectives() {
    if (!this.allLearningObjectives.length) {
      const learningObjectivesList = (await this.redis.get(
        "learningObjectiveList"
      )) as string;
      const learningObjectiveIds = learningObjectivesList.split(",");
      const chunks = this.chunk(learningObjectiveIds, 800);
      this.allLearningObjectives = (
        await Promise.all(
          chunks.map(
            (chunk) => this.redis.mget(...chunk) as Promise<LearningObjective[]>
          )
        )
      ).flat();
    }
    return this.allLearningObjectives;
  }

  async writeQuestions(questions: QuestionTemplate[]) {
    const questionBlocks = this.chunk(questions, 800);
    let completedEntries = 0;

    await Promise.all(
      questionBlocks.map(async (block) => {
        await this.redis.mset(
          block.reduce<Record<QuestionTemplateId, QuestionTemplate>>(
            (sum, question) => {
              sum[question.id] = question;
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
    const questionList = questions.map((q) => q.id).join(",");
    await this.redis.set("questionList", questionList);

    const questionBlocks2 = this.chunk(
      questions,
      Math.ceil(questions.length / COMPRESS_QUESTION_BLOCKS_NUMBER)
    );

    let completedEntries2 = 0;
    await Promise.all(
      questionBlocks2.map(async (block, i) => {
        const textBlock = await compress(JSON.stringify(block));
        await this.redis.set(`questionsCompressed${i}`, textBlock);
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
              sum[lo.id] = lo;
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
    await this.redis.set("learningObjectiveList", learningObjectiveList);
  }
}
