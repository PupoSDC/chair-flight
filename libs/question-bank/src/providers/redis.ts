import { compress, decompress } from "shrink-string";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { NotFoundError } from "@chair-flight/base/errors";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { redis } from "@chair-flight/base/upstash";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import type {
  LearningObjective,
  LearningObjectiveId,
  QuestionTemplate,
  QuestionTemplateId,
  QuestionBankRepository,
} from "@chair-flight/base/types";

const COMPRESS_QUESTION_BLOCKS_NUMBER = 10;

export class QuestionBankRedisRepository implements QuestionBankRepository {
  private static allQuestions: QuestionTemplate[] = [];
  private static allQuestionsMap: Record<QuestionTemplateId, QuestionTemplate> =
    {};
  private static allLearningObjectives: LearningObjective[] = [];
  private static allLearningObjectivesMap: Record<
    LearningObjectiveId,
    LearningObjective
  > = {};

  private chunk = <T>(arr: T[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );

  async getQuestionTemplate(questionId: string) {
    const question =
      QuestionBankRedisRepository.allQuestionsMap[questionId] ||
      ((await redis.get(questionId)) as QuestionTemplate);
    if (!question) {
      throw new NotFoundError(`Question ${questionId} not found`);
    }
    return question;
  }

  async getLearningObjective(learningObjectiveId: LearningObjectiveId) {
    const allLearningObjectives = await this.getAllLearningObjectives();
    const learningObjective = allLearningObjectives.find(
      (lo) => lo.id === learningObjectiveId
    );
    if (!learningObjective) {
      throw new NotFoundError(
        `Learning objective ${learningObjectiveId} not found`
      );
    }
    return learningObjective;
  }

  async getLearningObjectives(learningObjectiveIds: LearningObjectiveId[]) {
    const allLearningObjectives = await this.getAllLearningObjectives();
    return allLearningObjectives.filter((lo) =>
      learningObjectiveIds.includes(lo.id)
    );
  }

  async getAllQuestionTemplates() {
    if (!QuestionBankRedisRepository.allQuestions.length) {
      QuestionBankRedisRepository.allQuestions = (
        await Promise.all(
          new Array(COMPRESS_QUESTION_BLOCKS_NUMBER)
            .fill(0)
            .map(async (_, i) => {
              const compressedQuestions = await redis.get(
                `questionsCompressed${i}`
              );
              const string = await decompress(compressedQuestions as string);
              return JSON.parse(string) as QuestionTemplate[];
            })
        )
      ).flat();
      QuestionBankRedisRepository.allQuestionsMap =
        QuestionBankRedisRepository.allQuestions.reduce<
          Record<QuestionTemplateId, QuestionTemplate>
        >((acc, question) => {
          acc[question.id] = question;
          return acc;
        }, {});
    }
    return QuestionBankRedisRepository.allQuestions;
  }

  async getAllLearningObjectives() {
    if (!QuestionBankRedisRepository.allLearningObjectives.length) {
      const learningObjectivesList = (await redis.get(
        "learningObjectiveList"
      )) as string;
      const learningObjectiveIds = learningObjectivesList.split(",");
      const chunks = this.chunk(learningObjectiveIds, 800);
      QuestionBankRedisRepository.allLearningObjectives = (
        await Promise.all(
          chunks.map(
            (chunk) => redis.mget(...chunk) as Promise<LearningObjective[]>
          )
        )
      ).flat();
      QuestionBankRedisRepository.allLearningObjectivesMap =
        QuestionBankRedisRepository.allLearningObjectives.reduce<
          Record<LearningObjectiveId, LearningObjective>
        >((acc, learningObjective) => {
          acc[learningObjective.id] = learningObjective;
          return acc;
        }, {});
    }
    return QuestionBankRedisRepository.allLearningObjectives;
  }

  async writeQuestions(questions: QuestionTemplate[]) {
    const questionBlocks = this.chunk(questions, 800);
    let completedEntries = 0;

    await Promise.all(
      questionBlocks.map(async (block) => {
        await redis.mset(
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
    await redis.set("questionList", questionList);

    const questionBlocks2 = this.chunk(
      questions,
      Math.ceil(questions.length / COMPRESS_QUESTION_BLOCKS_NUMBER)
    );

    let completedEntries2 = 0;
    await Promise.all(
      questionBlocks2.map(async (block, i) => {
        const textBlock = await compress(JSON.stringify(block));
        await redis.set(`questionsCompressed${i}`, textBlock);
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
        await redis.mset(
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
    await redis.set("learningObjectiveList", learningObjectiveList);
  }
}
