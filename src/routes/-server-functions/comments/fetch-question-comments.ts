import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, or, sql } from "drizzle-orm";
import { z } from "zod";
import { commentVotes, profiles, questionComments } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-banks/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import { authMiddleware } from "../auth/auth-middleware";
import type {
  CommentVote,
  QuestionComment,
} from "../../../libs/core/community/comment";

export const fetchQuestionComments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      questionBank: z.enum(QUESTION_BANK_NAMES),
      questionId: z.string().min(1),
    }),
  )
  .handler(async ({ data, context }): Promise<QuestionComment[]> => {
    const isApproved = eq(questionComments.status, "approved");
    const score = sql<number>`coalesce((select sum(${commentVotes.value}) from ${commentVotes} where ${commentVotes.commentId} = ${questionComments.id}), 0)::int`;
    const myVote = sql<number>`coalesce((select ${commentVotes.value} from ${commentVotes} where ${commentVotes.commentId} = ${questionComments.id} and ${commentVotes.userId} = ${context.user?.id ?? null}), 0)::int`;
    const isVisible = !context.user
      ? isApproved
      : context.user.role === "admin"
        ? or(isApproved, eq(questionComments.status, "pending"))
        : or(
            isApproved,
            and(
              eq(questionComments.authorId, context.user.id),
              eq(questionComments.status, "pending"),
            ),
          );
    const rows = await getSupabaseDb()
      .select({
        id: questionComments.id,
        parentId: questionComments.parentId,
        depth: questionComments.depth,
        body: questionComments.body,
        status: questionComments.status,
        createdAt: questionComments.createdAt,
        score,
        myVote,
        authorId: questionComments.authorId,
        username: profiles.username,
        role: profiles.role,
      })
      .from(questionComments)
      .innerJoin(profiles, eq(profiles.id, questionComments.authorId))
      .where(
        and(
          eq(questionComments.questionBank, data.questionBank),
          eq(questionComments.questionId, data.questionId),
          isVisible,
        ),
      )
      .orderBy(
        asc(questionComments.depth),
        desc(score),
        asc(questionComments.createdAt),
      );
    const visibleIds = new Set<string>();
    return rows.flatMap(
      ({ username, role, authorId, createdAt, myVote, ...row }) => {
        if (row.parentId && !visibleIds.has(row.parentId)) return [];
        visibleIds.add(row.id);
        return {
          ...row,
          myVote: myVote as CommentVote,
          createdAt: createdAt.toISOString(),
          author: { id: authorId, username, role },
        };
      },
    );
  });
