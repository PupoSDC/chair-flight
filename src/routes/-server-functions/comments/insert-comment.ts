import { and, count, eq } from "drizzle-orm";
import {
  a320Questions,
  atplQuestions,
  b737Questions,
  questionComments,
} from "../../../database";
import {
  getReplyPlacement,
  MAX_PENDING_COMMENTS,
} from "../../../libs/core/community/comment";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import type { QuestionComment } from "../../../libs/core/community/comment";
import type { UserProfile } from "../../../libs/core/community/user";
import type { QuestionBankName } from "../../../libs/core/question-banks/question-banks";

const QUESTION_TABLES = {
  atpl: atplQuestions,
  a320: a320Questions,
  b737: b737Questions,
};

export const insertComment = async (input: {
  author: UserProfile;
  questionBank: Exclude<QuestionBankName, "prep">;
  questionId: string;
  parentId: string | null;
  body: string;
}): Promise<QuestionComment> => {
  const db = getSupabaseDb();
  const questions = QUESTION_TABLES[input.questionBank];
  const isAdmin = input.author.role === "admin";
  const [question] = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.id, input.questionId));
  if (!question) throw new Error("Question not found.");
  const [parent] = input.parentId
    ? await db
        .select({
          id: questionComments.id,
          parentId: questionComments.parentId,
          depth: questionComments.depth,
        })
        .from(questionComments)
        .where(
          and(
            eq(questionComments.id, input.parentId),
            eq(questionComments.questionBank, input.questionBank),
            eq(questionComments.questionId, input.questionId),
            eq(questionComments.status, "approved"),
          ),
        )
    : [];
  if (input.parentId && !parent) throw new Error("Comment not found.");
  if (!isAdmin) {
    const [pending] = await db
      .select({ total: count() })
      .from(questionComments)
      .where(
        and(
          eq(questionComments.authorId, input.author.id),
          eq(questionComments.status, "pending"),
        ),
      );
    if ((pending?.total ?? 0) >= MAX_PENDING_COMMENTS) {
      throw new Error(
        "You have too many comments awaiting approval. Try again later.",
      );
    }
  }
  const [comment] = await db
    .insert(questionComments)
    .values({
      questionBank: input.questionBank,
      questionId: input.questionId,
      authorId: input.author.id,
      body: input.body,
      status: isAdmin ? "approved" : "pending",
      reviewedAt: isAdmin ? new Date() : null,
      reviewedBy: isAdmin ? input.author.id : null,
      ...getReplyPlacement(parent ?? null),
    })
    .returning();
  if (!comment) throw new Error("Could not save the comment.");
  return {
    id: comment.id,
    parentId: comment.parentId,
    depth: comment.depth,
    body: comment.body,
    status: comment.status,
    createdAt: comment.createdAt.toISOString(),
    score: 0,
    myVote: 0,
    author: {
      id: input.author.id,
      username: input.author.username,
      role: input.author.role,
    },
  };
};
