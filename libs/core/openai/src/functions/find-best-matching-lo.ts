import { NotFoundError } from "@chair-flight/base/errors";
import { redis } from "@chair-flight/base/upstash";
import { openAi } from "../providers/openai";
import { cosineSimilarity } from "./cosine-similarity";
import type { QuestionBankRepository } from "@chair-flight/base/types";

const PARALLEL_REQUESTS = 30;

type RedisEmbedding = {
  id: string;
  text: string;
  embeddings: number[];
};

const chunck = <T>(arr: T[], numberOfChunks: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < numberOfChunks; i++) {
    chunks.push([]);
  }
  for (let i = 0; i < arr.length; i++) {
    chunks[i % numberOfChunks].push(arr[i]);
  }
  return chunks;
};

export const createLearningObjectivesEmbeddings = async ({
  questionBank,
}: {
  questionBank: QuestionBankRepository;
}) => {
  const learningObjectives = await questionBank.getAllLearningObjectives();
  const snippetLos = learningObjectives.filter(
    (lo) => lo.id.split(".").length === 5
  );

  let processed = 0;
  const currentEmbeddings: RedisEmbedding[] = [];

  const chunks = chunck(snippetLos, PARALLEL_REQUESTS);

  await Promise.all(
    chunks.map(async (chunk) => {
      for (let i = 0; i < chunk.length; i++) {
        const { text, id } = chunk[i];
        const completion = await openAi.createEmbedding({
          model: "text-embedding-ada-002",
          input: text,
        });
        currentEmbeddings.push({
          id,
          text,
          embeddings: completion.data.data[0].embedding,
        });
        console.log(`processed ${processed++} / ${snippetLos.length}`);
      }
    })
  );

  const embeddings = chunck(currentEmbeddings, 100);
  for (let i = 0; i < embeddings.length; i++) {
    const thisEmbeddings = embeddings[i];
    await redis.set(`learning-objectives-embeddings-${i}`, thisEmbeddings);
  }
};

export const createQuestionTemplateEmbeddings = async ({
  questionBank,
}: {
  questionBank: QuestionBankRepository;
}) => {
  const questionTemplates = await questionBank.getAllQuestionTemplates();
  const acceptableTemplates = questionTemplates.filter(
    (template) =>
      template.learningObjectives.length === 1 &&
      template.learningObjectives[0].split(".").length === 2
  );

  const chunks = chunck(acceptableTemplates, PARALLEL_REQUESTS);

  let processed = 0;

  await Promise.all(
    chunks.map(async (chunk) => {
      for (let i = 0; i < chunk.length; i++) {
        const template = chunk[i];
        const variant = Object.values(template.variants)[0];

        if (variant.type !== "simple") continue;
        const text = variant.question + variant.options[0];
        const id = template.id;
        try {
          const completion = await openAi.createEmbedding({
            model: "text-embedding-ada-002",
            input: text,
          });
          await redis.set(`question-template-embeddings-${id}`, {
            id,
            text,
            embeddings: completion.data.data[0].embedding,
          });
          processed++;
          console.log(`processed ${processed} / ${questionTemplates.length}`);
        } catch (e) {
          console.log(`error processing ${processed}`);
          i--;
        }
      }
    })
  );
};

const getAllLearningObjectivesEmbeddings = async () => {
  const keys = await redis.keys("learning-objectives-embeddings-*");
  const allEmbeddings: RedisEmbedding[] = [];

  for (const key of keys) {
    const embeddings = await redis.get<RedisEmbedding[]>(key);
    if (!embeddings) throw new NotFoundError("No embeddings found");
    allEmbeddings.push(...embeddings);
  }
  return allEmbeddings;
};

export const applyBestMatchingLoToAllQuestions = async ({
  questionBank,
}: {
  questionBank: QuestionBankRepository;
}) => {
  const allTemplates = await questionBank.getAllQuestionTemplates();
  const loEmbeddings = await getAllLearningObjectivesEmbeddings();

  const filteredTemplates = allTemplates.filter(
    (template) =>
      template.learningObjectives.length === 1 &&
      template.learningObjectives[0].startsWith("022.07")
  );

  for (let i = 0; i < filteredTemplates.length; i++) {
    const template = filteredTemplates[i];
    console.log(`processing ${i} / ${allTemplates.length}`);
    const templateEmbedding = await redis.get<RedisEmbedding>(
      `question-template-embeddings-${template.id}`
    );
    if (!templateEmbedding) continue;

    const relevantLos = loEmbeddings
      .filter((lo) =>
        lo.id.startsWith(template.learningObjectives[0].split(".")[0])
      )
      .filter((lo) => !lo.id.startsWith("022.07"));

    const result = relevantLos
      .map((lo) => ({
        id: lo.id,
        text: lo.text,
        similarity: cosineSimilarity(
          templateEmbedding.embeddings,
          lo.embeddings
        ),
      }))
      .sort((a, b) => b.similarity - a.similarity)[0];

    if (!result) continue;
    template.learningObjectives = [result.id];
  }

  await questionBank.writeQuestions(allTemplates);
};
