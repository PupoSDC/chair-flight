import type { UserRole } from "./user";

export const MAX_COMMENT_DEPTH = 3;
export const MAX_COMMENT_LENGTH = 1024;
export const MAX_PENDING_COMMENTS = 10;

export type CommentVote = -1 | 0 | 1;

export type CommentStatus = "pending" | "approved" | "rejected";

export type QuestionComment = {
  id: string;
  parentId: string | null;
  depth: number;
  body: string;
  status: CommentStatus;
  createdAt: string;
  score: number;
  myVote: CommentVote;
  author: { id: string; username: string; role: UserRole };
};

export const getReplyPlacement = (
  parent: { id: string; parentId: string | null; depth: number } | null,
) => {
  if (!parent) return { parentId: null, depth: 1 };
  if (parent.depth >= MAX_COMMENT_DEPTH) {
    return { parentId: parent.parentId, depth: MAX_COMMENT_DEPTH };
  }
  return { parentId: parent.id, depth: parent.depth + 1 };
};
