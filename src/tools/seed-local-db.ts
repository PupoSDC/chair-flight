import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  commentVotes,
  profiles,
  questionComments,
} from "../database/schema/community.ts";
import { atplQuestions } from "../database/schema/module-atpl.ts";
import community from "../database/seed/community.json" with { type: "json" };
import { chunkItems } from "../libs/base/chunk-items.ts";
import { isLocalDatabase } from "../libs/base/is-local-database.ts";
import { readEnv } from "../libs/base/read-env.ts";
import { getReplyPlacement } from "../libs/core/community/comment.ts";

type Transaction = Parameters<
  Parameters<ReturnType<typeof drizzle>["transaction"]>[0]
>[0];

const BIG_DISCUSSION = { questionBank: "atpl", questionId: "QSCLCOEJ7" };
const BIG_DISCUSSION_SIZE = 200;

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

const seedBigDiscussion = async (db: Transaction, userIds: string[]) => {
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

const seedMockCommunity = async (db: Transaction) => {
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
    .where(isNull(atplQuestions.removedAt))
    .orderBy(atplQuestions.id)
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
    .where(
      and(
        eq(atplQuestions.id, BIG_DISCUSSION.questionId),
        isNull(atplQuestions.removedAt),
      ),
    );
  if (bigQuestion) {
    const result = await seedBigDiscussion(
      db,
      users.map((user) => user.id),
    );
    console.info(
      `Seeded ${result.comments} comments and ${result.votes} votes on ${BIG_DISCUSSION.questionId}.`,
    );
  }

  return users;
};

const databaseUrl = readEnv("DATABASE_URL");
if (!isLocalDatabase(databaseUrl)) {
  throw new Error("Mock users and comments can only be seeded locally.");
}

const connection = postgres(databaseUrl, { prepare: false, max: 1 });
const db = drizzle(connection);
try {
  const users = await db.transaction(seedMockCommunity);
  console.info(`Seeded ${users.length} mock users. Impersonate with:`);
  for (const user of users) {
    console.info(
      `  http://localhost:3100/auth/impersonate/${user.id}  ${user.username} (${user.role})`,
    );
  }
} finally {
  await connection.end();
}
