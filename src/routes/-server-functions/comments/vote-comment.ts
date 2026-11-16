import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { commentVotes, questionComments } from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import { authMiddleware } from "../auth/auth-middleware";
import { requireUser } from "../auth/require-user";

export const voteComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      commentId: z.uuid(),
      value: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
    }),
  )
  .handler(async ({ data, context }) => {
    const user = requireUser(context.user);
    const db = getSupabaseDb();
    const [comment] = await db
      .select({
        id: questionComments.id,
        authorId: questionComments.authorId,
      })
      .from(questionComments)
      .where(
        and(
          eq(questionComments.id, data.commentId),
          eq(questionComments.status, "approved"),
        ),
      );
    if (!comment) throw new Error("Comment not found.");
    if (comment.authorId === user.id) {
      throw new Error("You can't vote on your own comment.");
    }
    if (data.value === 0) {
      await db
        .delete(commentVotes)
        .where(
          and(
            eq(commentVotes.commentId, comment.id),
            eq(commentVotes.userId, user.id),
          ),
        );
    } else {
      await db
        .insert(commentVotes)
        .values({
          commentId: comment.id,
          userId: user.id,
          value: data.value,
        })
        .onConflictDoUpdate({
          target: [commentVotes.commentId, commentVotes.userId],
          set: { value: sql`excluded.value` },
        });
    }
    return { id: comment.id, myVote: data.value };
  });
