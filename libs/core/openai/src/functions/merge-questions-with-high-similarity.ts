import { getQuestionPreview } from "@chair-flight/core/app";
import { getOpenAi } from "@chair-flight/external/openai";
import { chunck } from "./chunck";
import { cosineSimilarity } from "./cosine-similarity";
import type { QuestionBankRepository } from "@chair-flight/base/types";

const PARALLEL_WORKERS = 10;

const subjects = [
  "010",
  "021",
  "022",
  "031",
  "032",
  "033",
  "040",
  "050",
  "061",
  "062",
  "071",
  "081",
  "090",
].reverse();

export const mergeQuestionsWithHighSimilarity = async ({
  questionBank,
}: {
  questionBank: QuestionBankRepository;
}) => {
  const openAi = getOpenAi();
  const templates = await questionBank.getAllQuestionTemplates();
  for (const subject of subjects) {
    const embeddings: Record<string, number[]> = {};
    const relevantTemplates = templates.filter((template) =>
      template.learningObjectives[0].startsWith(subject),
    );

    let processed = 0;
    await Promise.all(
      chunck(relevantTemplates, PARALLEL_WORKERS).map(async (chunk) => {
        for (let i = 0; i < chunk.length; i++) {
          const template = chunk[i];

          const embedding = await openAi.createEmbedding({
            model: "text-embedding-ada-002",
            input: getQuestionPreview(
              template,
              Object.keys(template.variants)[0],
            ),
          });
          if (!embedding) continue;
          embeddings[template.id] = embedding.data.data[0].embedding;
          console.log(
            `[${subject}] processed ${++processed} / ${
              relevantTemplates.length
            }`,
          );
        }
      }),
    );

    const relevantMatches: [string, string, number][] = [];
    for (let i = 0; i < relevantTemplates.length; i++) {
      console.log(
        `[${subject}] comparing ${i + 1} / ${relevantTemplates.length}`,
      );

      for (let j = i + 1; j < relevantTemplates.length; j++) {
        const template1 = relevantTemplates[i];
        const template2 = relevantTemplates[j];

        const similarity = cosineSimilarity(
          embeddings[template1.id],
          embeddings[template2.id],
        );

        if (similarity > 0.98) {
          relevantMatches.push([template1.id, template2.id, similarity]);
        }
      }
    }

    for (const [template1Id, template2Id] of relevantMatches) {
      const template1 = templates.find((q) => q.id === template1Id);
      const template2 = templates.find((q) => q.id === template2Id);
      if (!template1 || !template2) continue;

      templates.splice(
        templates.findIndex((q) => q.id === template2Id),
        1,
      );

      Object.values(template1.variants)[0].externalIds = [
        ...new Set([
          ...Object.values(template1.variants).flatMap((q) => q.externalIds),
          ...Object.values(template2.variants)[0].externalIds,
        ]),
      ];
    }

    await questionBank.writeQuestions(templates);
  }
};
