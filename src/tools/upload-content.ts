import * as fs from "node:fs/promises";
import * as path from "node:path";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as YAML from "yaml";
import * as tables from "../database/schema/question-bank.ts";
import { chunkItems } from "../libs/base/chunk-items.ts";
import { readEnv } from "../libs/base/read-env.ts";
import { connectQuestionBank } from "../libs/core/question-bank/connect-question-bank.ts";
import { QUESTION_BANK_NAMES } from "../libs/core/question-bank/question-banks.ts";
import type { QuestionBankName } from "../libs/core/question-bank/question-banks.ts";

type RawQuestionBank = Parameters<typeof connectQuestionBank>[0];

const FRONT_MATTER_MATCH = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const CHUNK_SIZE = 500;

const findFiles = async (folder: string, fileName: string) => {
  const files = await fs.readdir(folder, { recursive: true }).catch(() => []);
  return files
    .filter((file) => path.basename(file) === fileName)
    .map((file) => path.join(folder, file))
    .sort();
};

const readYamlFiles = async <T>(folder: string, fileName: string) => {
  const files = await findFiles(folder, fileName);
  const contents = await Promise.all(
    files.map((file) => fs.readFile(file, "utf-8")),
  );
  return contents.flatMap((content) => (YAML.parse(content) ?? []) as T[]);
};

const readDocs = async (folder: string) => {
  const files = await findFiles(folder, "page.md");
  return Promise.all(
    files.map(async (file) => {
      const source = await fs.readFile(file, "utf-8");
      const match = FRONT_MATTER_MATCH.exec(source);
      if (!match) throw new Error(`Missing front matter for ${file}.`);
      const data = YAML.parse(match[1]);
      return {
        id: String(data.id),
        parentId: data.parent ? String(data.parent) : null,
        title: String(data.title ?? ""),
        description: String(data.description ?? ""),
        content: source.slice(match[0].length).trim(),
      };
    }),
  );
};

const readFlashcards = async (
  questionBank: QuestionBankName,
  folder: string,
) => {
  const files = await fs.readdir(folder).catch(() => []);
  const collections = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        const content = await fs.readFile(path.join(folder, file), "utf-8");
        const cards = JSON.parse(content) as {
          id: string;
          question: string | null;
          answer: string | null;
        }[];
        return cards
          .filter(
            (card, index) =>
              cards.findIndex((other) => other.id === card.id) === index,
          )
          .filter((card) => card.question)
          .map((card) => ({
            questionBank,
            collectionId: file.replace(".json", ""),
            id: card.id,
            question: card.question,
            answer: card.answer ?? "",
          }));
      }),
  );
  return collections.flat();
};

const readQuestionBank = async (questionBank: QuestionBankName) => {
  const root = path.join("content", `question-bank-${questionBank}`);
  const folder = path.join(root, "content");
  const connected = connectQuestionBank({
    questionBank,
    annexBaseUrl: `${readEnv("SUPABASE_URL")}/storage/v1/object/public/chair-flight`,
    subjects: await readYamlFiles<RawQuestionBank["subjects"][number]>(
      folder,
      "subjects.yaml",
    ),
    learningObjectives: await readYamlFiles<
      RawQuestionBank["learningObjectives"][number]
    >(folder, "learning-objectives.yaml"),
    questions: await readYamlFiles<RawQuestionBank["questions"][number]>(
      folder,
      "questions.yaml",
    ),
    annexes: await readYamlFiles<RawQuestionBank["annexes"][number]>(
      folder,
      "annexes.yaml",
    ),
    docs: await readDocs(folder),
  });
  return {
    ...connected,
    courses: (
      await readYamlFiles<{ id: string; text: string }>(folder, "courses.yaml")
    ).map((course) => ({ questionBank, ...course })),
    flashcards: await readFlashcards(
      questionBank,
      path.join(root, "flashcards"),
    ),
  };
};

const uploadContent = async () => {
  const dryRun = process.argv.includes("--dry-run");
  const banks = await Promise.all(
    QUESTION_BANK_NAMES.map(async (questionBank) => ({
      questionBank,
      content: await readQuestionBank(questionBank),
    })),
  );

  for (const { questionBank, content } of banks) {
    const counts = Object.entries(content).map(
      ([name, rows]) => `${rows.length} ${name}`,
    );
    console.info(`${questionBank}: ${counts.join(", ")}`);
  }
  if (dryRun) return;

  const connection = postgres(readEnv("DATABASE_URL"), {
    prepare: false,
    max: 1,
  });
  try {
    await drizzle(connection).transaction(async (tx) => {
      for (const { questionBank, content } of banks) {
        for (const name of Object.keys(content) as (keyof typeof content)[]) {
          const table = tables[name];
          await tx.delete(table).where(eq(table.questionBank, questionBank));
          for (const chunk of chunkItems<object>(content[name], CHUNK_SIZE)) {
            await tx.insert(table).values(chunk as never);
          }
        }
      }
    });
    console.info("Content uploaded.");
  } finally {
    await connection.end();
  }
};

await uploadContent();
