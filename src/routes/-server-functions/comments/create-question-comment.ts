import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { QUESTION_BANKS_WITH_QUESTIONS } from "../../../libs/core/question-banks/question-banks";
import { authMiddleware } from "../auth/auth-middleware";
import { requireUser } from "../auth/require-user";
import { COMMENT_BODY_SCHEMA } from "./comment-input";
import { insertComment } from "./insert-comment";

export const createQuestionComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      questionBank: z.enum(QUESTION_BANKS_WITH_QUESTIONS),
      questionId: z.string().min(1),
      parentId: z.uuid().nullable(),
      body: COMMENT_BODY_SCHEMA,
    }),
  )
  .handler(async ({ data, context }) =>
    insertComment({ ...data, author: requireUser(context.user) }),
  );
