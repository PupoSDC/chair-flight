import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { questionComments } from "../../../database";
import { QUESTION_BANKS_WITH_QUESTIONS } from "../../../libs/core/question-banks/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import { authMiddleware } from "../auth/auth-middleware";
import { requireAdmin } from "../auth/require-admin";
import { COMMENT_BODY_SCHEMA } from "./comment-input";
import { insertComment } from "./insert-comment";

export const reviewComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.discriminatedUnion("decision", [
      z.object({
        decision: z.literal("approve"),
        commentId: z.uuid(),
        reply: COMMENT_BODY_SCHEMA.nullable(),
      }),
      z.object({ decision: z.literal("reject"), commentId: z.uuid() }),
    ]),
  )
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context.user);
    const [comment] = await getSupabaseDb()
      .update(questionComments)
      .set({
        status: data.decision === "approve" ? "approved" : "rejected",
        reviewedAt: new Date(),
        reviewedBy: admin.id,
      })
      .where(
        and(
          eq(questionComments.id, data.commentId),
          eq(questionComments.status, "pending"),
        ),
      )
      .returning();
    if (!comment) throw new Error("That comment was already reviewed.");
    const questionBank = QUESTION_BANKS_WITH_QUESTIONS.find(
      (name) => name === comment.questionBank,
    );
    if (data.decision === "approve" && data.reply && questionBank) {
      await insertComment({
        author: admin,
        questionBank,
        questionId: comment.questionId,
        parentId: comment.id,
        body: data.reply,
      });
    }
    return { id: comment.id, status: comment.status };
  });
