import * as fs from "node:fs/promises";
import * as path from "node:path";
import { inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as YAML from "yaml";
import {
  commentVotes,
  profiles,
  questionComments,
} from "../database/schema/community.ts";
import {
  a320Annexes,
  a320Chapters,
  a320Questions,
  a320QuestionsToAnnexes,
  a320QuestionsToQuestions,
} from "../database/schema/module-a320.ts";
import {
  atplAnnexes,
  atplCourses,
  atplDocs,
  atplExternalIds,
  atplLearningObjectiveCourses,
  atplLearningObjectiveRevisions,
  atplLearningObjectives,
  atplLearningObjectiveVersions,
  atplQuestionLearningObjectives,
  atplQuestions,
  atplQuestionsToAnnexes,
  atplQuestionsToExternalIds,
  atplQuestionsToQuestions,
  atplSubjects,
} from "../database/schema/module-atpl.ts";
import {
  b737Annexes,
  b737Chapters,
  b737Questions,
  b737QuestionsToAnnexes,
  b737QuestionsToQuestions,
} from "../database/schema/module-b737.ts";
import { prepFlashcards } from "../database/schema/module-prep.ts";
import community from "../database/seed/community.json" with { type: "json" };
import { chunkItems } from "../libs/base/chunk-items.ts";
import { isLocalDatabase } from "../libs/base/is-local-database.ts";
import { readEnv } from "../libs/base/read-env.ts";
import { getReplyPlacement } from "../libs/core/community/comment.ts";
import { getQuestionPreview } from "../libs/core/question-templates/get-question-preview.ts";
import type { PgTable } from "drizzle-orm/pg-core";
import type { QuestionTemplate } from "../libs/core/question-templates/question-template.ts";

type Transaction = Parameters<
  Parameters<ReturnType<typeof drizzle>["transaction"]>[0]
>[0];

const FRONT_MATTER_MATCH = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const ANNEX_LINK_MATCH = /(\]\()annex:([^)]*)\)/g;
const INSERT_CHUNK_SIZE = 500;

const BIG_DISCUSSION = { questionBank: "atpl", questionId: "QSCLCOEJ7" };
const BIG_DISCUSSION_SIZE = 200;

const dryRun = process.argv.includes("--dry-run");

const readFolderFiles = async (folder: string, extension: string) =>
  (await fs.readdir(folder, { recursive: true }).catch(() => []))
    .filter((file) => file.endsWith(extension))
    .sort()
    .map((file) => path.join(folder, file));

const readYamlFile = async <T>(file: string) =>
  (YAML.parse(await fs.readFile(file, "utf-8").catch(() => "")) ?? []) as T[];

const readYamlFolder = async <T>(folder: string) =>
  (
    await Promise.all(
      (
        await readFolderFiles(folder, ".yaml")
      ).map((file) => readYamlFile<T>(file)),
    )
  ).flat();

const readDocs = async (folder: string) =>
  Promise.all(
    (await readFolderFiles(folder, ".md")).map(async (file) => {
      const source = await fs.readFile(file, "utf-8");
      const match = FRONT_MATTER_MATCH.exec(source);
      if (!match) throw new Error(`Missing front matter for ${file}.`);
      const data = YAML.parse(match[1]);
      return {
        id: String(data.id),
        parentId: data.parent ? String(data.parent) : null,
        subject: data.subject ? String(data.subject) : null,
        title: String(data.title ?? ""),
        description: String(data.description ?? ""),
        content: source.slice(match[0].length).trim(),
      };
    }),
  );

const readAnnexes = async (questionBank: string) => {
  const annexes = await readYamlFile<{
    id: string;
    format: string;
    description?: string;
    source?: string;
  }>(
    path.join(
      "content",
      `question-bank-${questionBank}`,
      "annexes",
      "annexes.yaml",
    ),
  );
  const rows = annexes.map((annex) => ({
    id: annex.id,
    href: `/content/annexes/${questionBank}/${annex.id}.${annex.format}`,
    format: annex.format,
    description: annex.description ?? "",
    source: annex.source ?? "",
  }));
  const hrefsById = new Map(rows.map((row) => [row.id, row.href]));
  const replaceAnnexLinks = (text: string) =>
    text.replaceAll(ANNEX_LINK_MATCH, (_, prefix: string, id: string) => {
      const href = hrefsById.get(id);
      if (!href) throw new Error(`Missing annex ${id}.`);
      return `${prefix}${href})`;
    });
  const replaceOptionAnnexes = (template: QuestionTemplate) =>
    template.type === "definition"
      ? {
          ...template,
          options: template.options.map((option) => {
            if (!option.annex) return option;
            const href = hrefsById.get(option.annex);
            if (!href) throw new Error(`Missing annex ${option.annex}.`);
            return { ...option, annex: href };
          }),
        }
      : template;
  return { rows, replaceAnnexLinks, replaceOptionAnnexes };
};

const readAtpl = async () => {
  const root = path.join("content", "question-bank-atpl");
  const {
    rows: annexes,
    replaceAnnexLinks,
    replaceOptionAnnexes,
  } = await readAnnexes("atpl");
  const subjects = await readYamlFile<{
    id: string;
    longName: string;
    shortName: string;
    numberOfExamQuestions: number;
    numberOfExamMinutes: number;
  }>(path.join(root, "content", "subjects.yaml"));
  const courses = await readYamlFile<{ id: string; text: string }>(
    path.join(root, "content", "courses.yaml"),
  );
  const docs = await readDocs(path.join(root, "docs"));
  const learningObjectives = await readYamlFile<{
    id: string;
    parentId: string | null;
    subject: string;
    docId: string | null;
    text: string;
    source: string;
    removed: boolean;
    courses: string[];
  }>(path.join(root, "content", "learning-objectives.yaml"));
  const questions = await readYamlFolder<{
    id: string;
    docId: string;
    relatedQuestions: string[];
    externalIds: string[];
    annexes: string[];
    learningObjectives: string[];
    template: QuestionTemplate;
  }>(path.join(root, "questions"));
  const historyFolder = path.join(root, "learning-objectives");
  const versions = await readYamlFile<{ id: string; position: number }>(
    path.join(historyFolder, "versions.yaml"),
  );
  const revisions = (
    await Promise.all(
      versions.map((version) =>
        readYamlFile<object>(path.join(historyFolder, `${version.id}.yaml`)),
      ),
    )
  ).flat();

  return {
    subjects: subjects.map((subject) => ({
      id: subject.id,
      longName: subject.longName,
      shortName: subject.shortName,
      numberOfExamQuestions: subject.numberOfExamQuestions,
      numberOfExamMinutes: subject.numberOfExamMinutes,
    })),
    courses,
    docs: docs.map((doc) => ({
      id: doc.id,
      parentId: doc.parentId,
      subject: doc.subject,
      title: doc.title,
      description: doc.description,
      content: replaceAnnexLinks(doc.content),
      empty: !doc.content,
    })),
    learningObjectives: learningObjectives.map((learningObjective) => ({
      id: learningObjective.id,
      parentId: learningObjective.parentId,
      subject: learningObjective.subject,
      docId: learningObjective.docId,
      text: learningObjective.text,
      source: learningObjective.source,
      removed: learningObjective.removed,
    })),
    learningObjectiveCourses: learningObjectives.flatMap((learningObjective) =>
      learningObjective.courses.map((courseId) => ({
        learningObjectiveId: learningObjective.id,
        courseId,
      })),
    ),
    externalIds: [
      ...new Set(questions.flatMap((question) => question.externalIds)),
    ].map((id) => ({ id })),
    annexes,
    questions: questions.map((question) => ({
      id: question.id,
      docId: question.docId,
      preview: getQuestionPreview(question.template),
      template: {
        ...replaceOptionAnnexes(question.template),
        explanation: replaceAnnexLinks(question.template.explanation),
      },
    })),
    questionExternalIds: questions.flatMap((question) =>
      question.externalIds.map((externalId) => ({
        questionId: question.id,
        externalId,
      })),
    ),
    questionLearningObjectives: questions.flatMap((question) =>
      question.learningObjectives.map((learningObjectiveId) => ({
        questionId: question.id,
        learningObjectiveId,
      })),
    ),
    relatedQuestions: questions.flatMap((question) =>
      question.relatedQuestions.map((relatedQuestionId) => ({
        questionId: question.id,
        relatedQuestionId,
      })),
    ),
    questionAnnexes: questions.flatMap((question) =>
      question.annexes.map((annexId) => ({
        questionId: question.id,
        annexId,
      })),
    ),
    versions,
    revisions,
  };
};

const readChapterBank = async (questionBank: "a320" | "b737") => {
  const root = path.join("content", `question-bank-${questionBank}`);
  const { rows: annexes, replaceAnnexLinks } = await readAnnexes(questionBank);
  const contentMap = YAML.parse(
    await fs.readFile(path.join(root, "content-map.yaml"), "utf-8"),
  ) as { chapters: { id: string; title: string; page?: string }[] };
  const docs = await readDocs(path.join(root, "docs"));
  const questions = await readYamlFolder<{
    id: string;
    chapter: string;
    annexes: string[];
    relatedQuestions: string[];
    template: QuestionTemplate;
  }>(path.join(root, "questions"));

  return {
    chapters: contentMap.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      content: replaceAnnexLinks(
        docs.find((doc) => doc.id === chapter.page)?.content ?? "",
      ),
    })),
    annexes,
    questions: questions.map((question) => ({
      id: question.id,
      chapter: question.chapter,
      preview: getQuestionPreview(question.template),
      template: {
        ...question.template,
        explanation: replaceAnnexLinks(question.template.explanation),
      },
    })),
    relatedQuestions: questions.flatMap((question) =>
      question.relatedQuestions.map((relatedQuestionId) => ({
        questionId: question.id,
        relatedQuestionId,
      })),
    ),
    questionAnnexes: questions.flatMap((question) =>
      question.annexes.map((annexId) => ({
        questionId: question.id,
        annexId,
      })),
    ),
  };
};

const readFlashcards = async () => {
  const folder = path.join("content", "question-bank-prep", "flashcards");
  const files = (await fs.readdir(folder).catch(() => [])).filter((file) =>
    file.endsWith(".json"),
  );
  const collections = await Promise.all(
    files.map(async (file) => {
      const cards = JSON.parse(
        await fs.readFile(path.join(folder, file), "utf-8"),
      ) as { id: string; question: string | null; answer: string | null }[];
      return cards
        .filter(
          (card, index) =>
            card.question &&
            cards.findIndex((other) => other.id === card.id) === index,
        )
        .map((card) => ({
          collectionId: file.replace(".json", ""),
          id: card.id,
          question: card.question as string,
          answer: card.answer ?? "",
        }));
    }),
  );
  return collections.flat();
};

const sortParentsFirst = <T extends { id: string; parentId: string | null }>(
  rows: T[],
) => {
  const rowsById = new Map(rows.map((row) => [row.id, row]));
  const getDepth = (row: T): number =>
    row.parentId && rowsById.has(row.parentId)
      ? 1 + getDepth(rowsById.get(row.parentId) as T)
      : 0;
  return rows
    .map((row) => ({ row, depth: getDepth(row) }))
    .sort((a, b) => a.depth - b.depth)
    .map(({ row }) => row);
};

const replaceTables = async (
  tx: Transaction,
  tables: { table: PgTable; rows: object[] }[],
) => {
  for (const { table } of [...tables].reverse()) await tx.delete(table);
  for (const { table, rows } of tables) {
    for (const chunk of chunkItems<object>(rows, INSERT_CHUNK_SIZE)) {
      await tx.insert(table).values(chunk as never);
    }
  }
};

const getMockUserId = (position: number) =>
  `00000000-0000-4000-8000-${String(position).padStart(12, "0")}`;

const createRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const seedBigDiscussion = async (
  db: ReturnType<typeof drizzle>,
  userIds: string[],
) => {
  const random = createRandom(2026);
  const pick = <T>(items: readonly T[]) =>
    items[Math.floor(random() * items.length)] as T;
  const comments: (typeof questionComments.$inferInsert & { id: string })[] =
    [];
  const approvedIds: string[] = [];
  const meta = new Map<
    string,
    { id: string; parentId: string | null; depth: number }
  >();

  for (let index = 0; index < BIG_DISCUSSION_SIZE; index++) {
    const isRoot = index < 20 || random() < 0.12;
    const parent = isRoot ? null : meta.get(pick(approvedIds));
    const body = isRoot
      ? random() < 0.35
        ? pick(community.longForms)
        : pick(community.openers)
      : random() < 0.2
        ? pick(community.longForms)
        : `${pick(community.followUps)} ${random() < 0.4 ? pick(community.openers) : ""}`.trim();
    const id = crypto.randomUUID();
    const placement = getReplyPlacement(parent ?? null);
    meta.set(id, { id, ...placement });
    approvedIds.push(id);
    comments.push({
      id,
      ...BIG_DISCUSSION,
      authorId: pick(userIds),
      body,
      status: "approved",
      ...placement,
      createdAt: new Date(
        Date.now() -
          (BIG_DISCUSSION_SIZE - index) * 55 * 6e4 -
          Math.floor(random() * 30) * 6e4,
      ),
    });
  }
  for (let index = 0; index < community.pendingBodies.length; index++) {
    comments.push({
      id: crypto.randomUUID(),
      ...BIG_DISCUSSION,
      authorId: userIds[index + 1] as string,
      body: community.pendingBodies[index] as string,
      status: "pending",
      depth: 1,
      parentId: null,
      createdAt: new Date(Date.now() - (index + 1) * 6e4),
    });
  }
  for (const chunk of chunkItems(comments, 100)) {
    await db.insert(questionComments).values(chunk);
  }

  const votes = comments
    .filter((comment) => comment.status === "approved")
    .flatMap((comment) => {
      const popularity = random();
      return userIds.flatMap((userId) =>
        userId === comment.authorId || random() > popularity * 0.7
          ? []
          : {
              commentId: comment.id,
              userId,
              value: random() < 0.82 ? 1 : -1,
            },
      );
    });
  for (const chunk of chunkItems(votes, 500)) {
    await db.insert(commentVotes).values(chunk);
  }
  return { comments: comments.length, votes: votes.length };
};

const seedMockCommunity = async (db: ReturnType<typeof drizzle>) => {
  const users = community.users.map((user, index) => ({
    id: getMockUserId(index + 1),
    ...(user as { username: string; role: "admin" | "user" }),
  }));
  await db
    .insert(profiles)
    .values(users)
    .onConflictDoUpdate({
      target: profiles.id,
      set: { username: sql`excluded.username`, role: sql`excluded.role` },
    });
  await db.delete(questionComments).where(
    inArray(
      questionComments.authorId,
      users.map((user) => user.id),
    ),
  );

  const [question] = await db
    .select({ id: atplQuestions.id })
    .from(atplQuestions)
    .limit(1);
  if (question) {
    const thread = async (
      authorPosition: number,
      body: string,
      status: "pending" | "approved",
      depth: number,
      parentId: string | null,
      minutesAgo: number,
    ) => {
      const [row] = await db
        .insert(questionComments)
        .values({
          questionBank: "atpl",
          questionId: question.id,
          authorId: getMockUserId(authorPosition),
          body,
          status,
          depth,
          parentId,
          createdAt: new Date(Date.now() - minutesAgo * 6e4),
        })
        .returning({ id: questionComments.id });
      return row?.id ?? null;
    };
    const root = await thread(
      2,
      "Why is C wrong here?",
      "approved",
      1,
      null,
      90,
    );
    const level2 = await thread(
      5,
      "Check the fuel flow units.",
      "approved",
      2,
      root,
      80,
    );
    await thread(3, "Ah, I mixed up kg and litres.", "approved", 3, level2, 70);
    await thread(4, "Same mistake, thanks!", "approved", 3, level2, 60);
    await thread(
      6,
      "@cadet_alice you can double check in the docs.",
      "approved",
      3,
      level2,
      50,
    );
    await thread(
      7,
      "Is this still in the 2024 syllabus?",
      "pending",
      1,
      null,
      30,
    );
    await thread(
      8,
      "Pending reply to a nested comment.",
      "pending",
      3,
      level2,
      20,
    );
    await thread(
      9,
      "Great question, saved it for revision.",
      "pending",
      1,
      null,
      10,
    );
  }

  const [bigQuestion] = await db
    .select({ id: atplQuestions.id })
    .from(atplQuestions)
    .where(sql`${atplQuestions.id} = ${BIG_DISCUSSION.questionId}`);
  if (bigQuestion) {
    const result = await seedBigDiscussion(
      db,
      users.map((user) => user.id),
    );
    console.info(
      `Seeded ${result.comments} comments and ${result.votes} votes on ${BIG_DISCUSSION.questionId}.`,
    );
  }

  console.info("Seeded 10 mock users. Impersonate with:");
  for (const user of users) {
    console.info(
      `  http://localhost:3100/auth/impersonate/${user.id}  ${user.username} (${user.role})`,
    );
  }
};

const [atpl, a320, b737, flashcards] = await Promise.all([
  readAtpl(),
  readChapterBank("a320"),
  readChapterBank("b737"),
  readFlashcards(),
]);

const summarise = (name: string, rows: Record<string, object[]>) =>
  console.info(
    `${name}: ${Object.entries(rows)
      .map(([rowName, items]) => `${items.length} ${rowName}`)
      .join(", ")}`,
  );
summarise("atpl", atpl);
summarise("a320", a320);
summarise("b737", b737);
console.info(`prep: ${flashcards.length} flashcards`);
if (dryRun) process.exit(0);

const databaseUrl = readEnv("DATABASE_URL");
const local = isLocalDatabase(databaseUrl);
if (!local && !process.argv.includes("--upstream")) {
  throw new Error(
    "Refusing to overwrite a database that is not local. Run `pnpm script:seed-database -- --upstream` to do it on purpose.",
  );
}

const connection = postgres(databaseUrl, { prepare: false, max: 1 });
const db = drizzle(connection);
try {
  await db.transaction(async (tx) => {
    await replaceTables(tx, [
      { table: atplSubjects, rows: atpl.subjects },
      { table: atplCourses, rows: atpl.courses },
      { table: atplDocs, rows: sortParentsFirst(atpl.docs) },
      { table: atplExternalIds, rows: atpl.externalIds },
      {
        table: atplLearningObjectives,
        rows: sortParentsFirst(atpl.learningObjectives),
      },
      {
        table: atplLearningObjectiveCourses,
        rows: atpl.learningObjectiveCourses,
      },
      { table: atplAnnexes, rows: atpl.annexes },
      { table: atplQuestions, rows: atpl.questions },
      { table: atplQuestionsToExternalIds, rows: atpl.questionExternalIds },
      {
        table: atplQuestionLearningObjectives,
        rows: atpl.questionLearningObjectives,
      },
      { table: atplQuestionsToQuestions, rows: atpl.relatedQuestions },
      { table: atplQuestionsToAnnexes, rows: atpl.questionAnnexes },
      { table: atplLearningObjectiveVersions, rows: atpl.versions },
      { table: atplLearningObjectiveRevisions, rows: atpl.revisions },
      {
        table: a320Chapters,
        rows: a320.chapters.map(({ id, title }) => ({ id, title })),
      },
      { table: a320Annexes, rows: a320.annexes },
      { table: a320Questions, rows: a320.questions },
      { table: a320QuestionsToQuestions, rows: a320.relatedQuestions },
      { table: a320QuestionsToAnnexes, rows: a320.questionAnnexes },
      { table: b737Chapters, rows: b737.chapters },
      { table: b737Annexes, rows: b737.annexes },
      { table: b737Questions, rows: b737.questions },
      { table: b737QuestionsToQuestions, rows: b737.relatedQuestions },
      { table: b737QuestionsToAnnexes, rows: b737.questionAnnexes },
      { table: prepFlashcards, rows: flashcards },
    ]);
  });
  console.info("Content seeded.");

  if (local) {
    await seedMockCommunity(db);
  } else {
    console.info("Mock users and comments are only seeded on local databases.");
  }
} finally {
  await connection.end();
}
