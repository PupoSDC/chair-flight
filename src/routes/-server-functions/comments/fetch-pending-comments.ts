import { createServerFn } from "@tanstack/react-start";
import { asc, eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import {
  a320Questions,
  atplQuestions,
  b737Questions,
  profiles,
  questionComments,
} from "../../../database";
import { QUESTION_BANKS_WITH_QUESTIONS } from "../../../libs/core/question-banks/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import { authMiddleware } from "../auth/auth-middleware";
import { requireAdmin } from "../auth/require-admin";

const PAGE_SIZE = 50;

const QUESTION_TABLES = {
  atpl: atplQuestions,
  a320: a320Questions,
  b737: b737Questions,
};

export const fetchPendingComments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    requireAdmin(context.user);
    const db = getSupabaseDb();
    const parents = alias(questionComments, "parents");
    const parentAuthors = alias(profiles, "parent_authors");
    const rows = await db
      .select({
        id: questionComments.id,
        questionBank: questionComments.questionBank,
        questionId: questionComments.questionId,
        body: questionComments.body,
        createdAt: questionComments.createdAt,
        username: profiles.username,
        parentBody: parents.body,
        parentUsername: parentAuthors.username,
      })
      .from(questionComments)
      .innerJoin(profiles, eq(profiles.id, questionComments.authorId))
      .leftJoin(parents, eq(parents.id, questionComments.parentId))
      .leftJoin(parentAuthors, eq(parentAuthors.id, parents.authorId))
      .where(eq(questionComments.status, "pending"))
      .orderBy(asc(questionComments.createdAt))
      .limit(PAGE_SIZE);
    const previewEntries = await Promise.all(
      QUESTION_BANKS_WITH_QUESTIONS.map(async (questionBank) => {
        const questions = QUESTION_TABLES[questionBank];
        const questionIds = rows
          .filter((row) => row.questionBank === questionBank)
          .map((row) => row.questionId);
        if (questionIds.length === 0) return [];
        const previews = await db
          .select({ id: questions.id, preview: questions.preview })
          .from(questions)
          .where(inArray(questions.id, questionIds));
        return previews.map(
          (question) =>
            [`${questionBank}:${question.id}`, question.preview] as const,
        );
      }),
    );
    const previewsByKey = new Map(previewEntries.flat());
    return rows.flatMap((row) => {
      const questionBank = QUESTION_BANKS_WITH_QUESTIONS.find(
        (name) => name === row.questionBank,
      );
      if (!questionBank) return [];
      return {
        ...row,
        questionBank,
        questionPreview:
          previewsByKey.get(`${questionBank}:${row.questionId}`) ?? null,
        createdAt: row.createdAt.toISOString(),
      };
    });
  });
