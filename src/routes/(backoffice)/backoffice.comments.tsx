import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatIsoDateAsDate } from "../../libs/base/format-values";
import { MAX_COMMENT_LENGTH } from "../../libs/core/community/comment";
import { Button } from "../../libs/ui/components/base/button";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { CommentMarkdown } from "../../libs/ui/components/community/comment-markdown";
import { cn } from "../../libs/ui/utils/cn";
import { fetchPendingComments } from "../-server-functions/comments/fetch-pending-comments";
import { reviewComment } from "../-server-functions/comments/review-comment";
import type { FC } from "react";
import type { QuestionBankName } from "../../libs/core/question-banks/question-banks";

type PendingComment = Awaited<ReturnType<typeof fetchPendingComments>>[number];

const PendingCommentCard: FC<{
  comment: PendingComment;
  onReviewed: () => void;
}> = ({ comment, onReviewed }) => {
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const trimmedReply = reply.trim();

  const review = async (decision: "approve" | "reject") => {
    setBusy(true);
    setError(undefined);
    try {
      await reviewComment({
        data:
          decision === "approve"
            ? { decision, commentId: comment.id, reply: trimmedReply || null }
            : { decision, commentId: comment.id },
      });
      onReviewed();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-rule bg-paper p-4",
      )}
    >
      <div className="flex flex-col gap-1 text-xs text-muted">
        <Link
          to={`/modules/${comment.questionBank as Exclude<QuestionBankName, "prep">}/questions/$questionId`}
          params={{ questionId: comment.questionId }}
          className="font-semibold text-accent"
        >
          {comment.questionBank.toUpperCase()} · {comment.questionId}
        </Link>
        {comment.questionPreview && (
          <Markdown>{comment.questionPreview}</Markdown>
        )}
      </div>
      {comment.parentBody && (
        <blockquote
          className={cn("m-0 border-l-2 border-rule pl-3 text-xs text-muted")}
        >
          <strong>{comment.parentUsername}</strong>
          <p className="m-0 line-clamp-3 whitespace-pre-wrap">
            {comment.parentBody}
          </p>
        </blockquote>
      )}
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 text-xs text-muted">
          <strong className="text-ink">{comment.username}</strong>
          <time dateTime={comment.createdAt}>
            {formatIsoDateAsDate(comment.createdAt)}
          </time>
        </div>
        <CommentMarkdown>{comment.body}</CommentMarkdown>
      </div>
      <textarea
        aria-label="Reply"
        placeholder="Reply (optional, published together with the approval)"
        maxLength={MAX_COMMENT_LENGTH}
        value={reply}
        onChange={(event) => setReply(event.target.value)}
        className={cn(
          "min-h-20 w-full resize-y rounded-md border border-rule-strong",
          "bg-paper p-2 text-[13px] text-ink placeholder:text-muted/50",
        )}
      />
      {error && (
        <p role="alert" className="m-0 text-xs text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button
          variant="danger"
          disabled={busy}
          onClick={() => review("reject")}
        >
          Reject
        </Button>
        <Button
          variant="success"
          disabled={busy}
          onClick={() => review("approve")}
        >
          {trimmedReply ? "Approve & reply" : "Approve"}
        </Button>
      </div>
    </li>
  );
};

const BackofficeCommentsPage: FC = () => {
  const [comments, setComments] = useState<PendingComment[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchPendingComments()
      .then(setComments)
      .catch(() => setError("Could not load the comments."));
  }, []);

  return (
    <>
      <div>
        <h1 className="m-0 text-2xl font-bold tracking-tight">
          Review comments
        </h1>
        <p className="m-0 text-sm text-muted">
          Comments awaiting approval
          {comments && ` (${comments.length})`}
        </p>
      </div>
      {error && <p className="m-0 text-sm text-danger">{error}</p>}
      {comments?.length === 0 && (
        <p className="m-0 text-sm text-muted">Nothing to review.</p>
      )}
      {comments && comments.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {comments.map((comment) => (
            <PendingCommentCard
              key={comment.id}
              comment={comment}
              onReviewed={() =>
                setComments((current) =>
                  current?.filter((other) => other.id !== comment.id),
                )
              }
            />
          ))}
        </ul>
      )}
    </>
  );
};

export const Route = createFileRoute("/(backoffice)/backoffice/comments")({
  component: BackofficeCommentsPage,
});
