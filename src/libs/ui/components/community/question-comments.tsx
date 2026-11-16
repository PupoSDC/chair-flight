import { useEffect, useMemo, useRef, useState } from "react";
import { createQuestionComment } from "../../../../routes/-server-functions/comments/create-question-comment";
import { fetchQuestionComments } from "../../../../routes/-server-functions/comments/fetch-question-comments";
import { reviewComment } from "../../../../routes/-server-functions/comments/review-comment";
import { voteComment } from "../../../../routes/-server-functions/comments/vote-comment";
import { formatIsoDateAsDate } from "../../../base/format-values";
import {
  MAX_COMMENT_DEPTH,
  MAX_COMMENT_LENGTH,
} from "../../../core/community/comment";
import { useAuth } from "../../hooks/use-auth";
import { ArrowDownIcon } from "../../icons/arrow-down-icon";
import { ArrowUpIcon } from "../../icons/arrow-up-icon";
import { cn } from "../../utils/cn";
import { Button } from "../base/button";
import { AccountModal } from "./account-modal";
import { CommentMarkdown } from "./comment-markdown";
import type { ComponentProps, FC } from "react";
import type {
  CommentVote,
  QuestionComment,
} from "../../../core/community/comment";
import type { UserProfile } from "../../../core/community/user";
import type { QuestionBankName } from "../../../core/question-banks/question-banks";

type Actions = {
  user: UserProfile | null;
  submit: (body: string, parentId: string | null) => Promise<void>;
  vote: (comment: QuestionComment, value: CommentVote) => void;
  review: (comment: QuestionComment, decision: "approve" | "reject") => void;
  requireSignIn: () => void;
};

const TextButton: FC<ComponentProps<"button">> = ({ className, ...props }) => (
  <button
    className={cn(
      "cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold",
      "text-muted hover:text-accent disabled:cursor-default",
      "disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

const CommentComposer: FC<{
  label: string;
  admin: boolean;
  initialBody?: string;
  autoFocus?: boolean;
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
}> = ({ label, admin, initialBody = "", autoFocus, onSubmit, onCancel }) => {
  const [body, setBody] = useState(initialBody);
  const [step, setStep] = useState<"write" | "preview">("write");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEmpty = !body.trim();

  useEffect(() => {
    if (step === "write" && autoFocus) {
      const textarea = textareaRef.current;
      textarea?.focus();
      textarea?.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, [autoFocus, step]);

  const submit = async () => {
    setBusy(true);
    setError(undefined);
    try {
      await onSubmit(body);
      setBody("");
      setStep("write");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
    }
    setBusy(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex flex-col rounded-lg border border-rule-strong bg-paper",
          "focus-within:border-accent",
        )}
      >
        {step === "write" ? (
          <textarea
            ref={textareaRef}
            aria-label={label}
            placeholder={label}
            maxLength={MAX_COMMENT_LENGTH}
            rows={3}
            className={cn(
              "max-h-72 min-h-20 w-full resize-none border-0 bg-transparent",
              "field-sizing-content p-3 text-[13px] text-ink outline-none",
              "placeholder:text-muted/60",
            )}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        ) : (
          <div className="min-h-20 p-3">
            <p
              className={cn(
                "m-0 mb-1 text-[11px] font-semibold tracking-wide",
                "text-muted uppercase",
              )}
            >
              Preview
            </p>
            <CommentMarkdown>{body}</CommentMarkdown>
          </div>
        )}
        <div
          className={cn(
            "flex flex-wrap items-center justify-end gap-2 px-2 pb-2",
          )}
        >
          <span
            className={cn(
              "mr-auto text-xs whitespace-nowrap text-muted",
              body.length >= MAX_COMMENT_LENGTH && "text-danger",
            )}
          >
            {body.length}/{MAX_COMMENT_LENGTH}
            {step === "write" && " · Markdown supported"}
          </span>
          {onCancel && (
            <Button className="border-0" disabled={busy} onClick={onCancel}>
              Cancel
            </Button>
          )}
          {step === "write" ? (
            <Button
              variant="primary"
              disabled={isEmpty}
              onClick={() => setStep("preview")}
            >
              Comment
            </Button>
          ) : (
            <>
              <Button disabled={busy} onClick={() => setStep("write")}>
                Edit
              </Button>
              <Button variant="primary" disabled={busy} onClick={submit}>
                {admin ? "Submit comment" : "Submit comment for review"}
              </Button>
            </>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="m-0 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

const VoteControls: FC<{
  comment: QuestionComment;
  vote: Actions["vote"];
  own: boolean;
}> = ({ comment, vote, own }) => (
  <span
    className="inline-flex items-center gap-1"
    title={own ? "You can't vote on your own comment" : undefined}
  >
    <TextButton
      type="button"
      aria-label="Upvote"
      disabled={own}
      aria-pressed={comment.myVote === 1}
      className={cn(
        "grid size-6 place-items-center rounded hover:bg-accent-soft",
        comment.myVote === 1 && "text-accent",
      )}
      onClick={() => vote(comment, comment.myVote === 1 ? 0 : 1)}
    >
      <ArrowUpIcon size={14} />
    </TextButton>
    <span
      className={cn(
        "min-w-4 text-center text-xs font-semibold text-muted tabular-nums",
        comment.myVote === 1 && "text-accent",
        comment.myVote === -1 && "text-danger",
      )}
    >
      {comment.score}
    </span>
    <TextButton
      type="button"
      aria-label="Downvote"
      disabled={own}
      aria-pressed={comment.myVote === -1}
      className={cn(
        "grid size-6 place-items-center rounded hover:bg-accent-soft",
        comment.myVote === -1 && "text-danger",
      )}
      onClick={() => vote(comment, comment.myVote === -1 ? 0 : -1)}
    >
      <ArrowDownIcon size={14} />
    </TextButton>
  </span>
);

type Sort = "top" | "new" | "old";

const SORT_LABELS: Record<Sort, string> = {
  top: "Top",
  new: "New",
  old: "Old",
};

const SORTERS: Record<
  Sort,
  (a: QuestionComment, b: QuestionComment) => number
> = {
  top: (a, b) => b.score - a.score || a.createdAt.localeCompare(b.createdAt),
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
  old: (a, b) => a.createdAt.localeCompare(b.createdAt),
};

const SortMenu: FC<{ value: Sort; onChange: (value: Sort) => void }> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative text-xs text-muted">
      <TextButton
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        Sort by: <span className="text-ink">{SORT_LABELS[value]}</span> ▾
      </TextButton>
      {open && (
        <ul
          className={cn(
            "absolute right-0 z-10 m-0 mt-1 flex list-none flex-col",
            "rounded-md border border-rule bg-paper p-1 shadow-sm",
          )}
        >
          {(Object.keys(SORT_LABELS) as Sort[]).map((option) => (
            <li key={option}>
              <TextButton
                type="button"
                aria-pressed={option === value}
                className={cn(
                  "w-full rounded px-3 py-1 text-left whitespace-nowrap",
                  option === value && "text-accent",
                )}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {SORT_LABELS[option]}
              </TextButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const countDescendants = (
  commentId: string,
  childrenByParent: Map<string, QuestionComment[]>,
): number =>
  (childrenByParent.get(commentId) ?? []).reduce(
    (total, child) => total + 1 + countDescendants(child.id, childrenByParent),
    0,
  );

const CommentItem: FC<{
  comment: QuestionComment;
  childrenByParent: Map<string, QuestionComment[]>;
  actions: Actions;
  highlightedId: string | null;
}> = ({ comment, childrenByParent, actions, highlightedId }) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const highlighted = highlightedId === comment.id;
  const [replying, setReplying] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = actions;
  const own = user?.id === comment.author.id;
  const replies = childrenByParent.get(comment.id) ?? [];
  const isPending = comment.status === "pending";
  const isDeepest = comment.depth >= MAX_COMMENT_DEPTH;
  const hiddenCount = countDescendants(comment.id, childrenByParent);

  useEffect(() => {
    if (highlighted) {
      itemRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [highlighted]);

  return (
    <li
      ref={itemRef}
      className={cn(
        "grid grid-cols-[1rem_minmax(0,1fr)] gap-x-2 rounded-md",
        highlighted && "bg-accent-soft ring-4 ring-accent-soft",
      )}
    >
      <div className="flex flex-col items-center">
        <TextButton
          type="button"
          aria-label={collapsed ? "Expand thread" : "Collapse thread"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand" : "Collapse"}
          className={cn(
            "grid size-4 flex-none place-items-center rounded border",
            "border-rule-strong text-[11px] leading-none",
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "+" : "−"}
        </TextButton>
        {!collapsed && (
          <button
            type="button"
            aria-label="Collapse thread"
            tabIndex={-1}
            className={cn(
              "group flex w-4 min-h-2 flex-1 cursor-pointer",
              "justify-center border-0 bg-transparent p-0",
            )}
            onClick={() => setCollapsed(true)}
          >
            <span
              className={cn(
                "h-full w-0.5 bg-rule-strong group-hover:bg-accent",
              )}
            />
          </button>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-2 pb-3">
        <header
          className={cn(
            "flex min-h-4 flex-wrap items-center gap-x-2 text-xs",
            "text-muted",
          )}
        >
          <strong className="text-ink">{comment.author.username}</strong>
          {own && (
            <span
              className={cn(
                "rounded border border-accent px-1 font-semibold",
                "text-accent",
              )}
            >
              You
            </span>
          )}
          {comment.author.role === "admin" && (
            <span
              className={cn(
                "rounded bg-accent-soft px-1 font-semibold text-accent",
              )}
            >
              Admin
            </span>
          )}
          <time dateTime={comment.createdAt}>
            {formatIsoDateAsDate(comment.createdAt)}
          </time>
          {!isPending && <span>{comment.score} points</span>}
          {collapsed && hiddenCount > 0 && (
            <span>
              · {hiddenCount} {hiddenCount === 1 ? "reply" : "replies"} hidden
            </span>
          )}
        </header>
        {!collapsed && (
          <>
            {isPending && (
              <p
                className={cn(
                  "m-0 rounded-md border border-warning px-2 py-1 text-xs",
                  "text-warning",
                )}
              >
                {own
                  ? cn(
                      "Awaiting approval. Only you and the moderators can see this comment until it is approved.",
                    )
                  : "Awaiting approval. Only you and the author can see this comment."}
              </p>
            )}
            <CommentMarkdown>{comment.body}</CommentMarkdown>
            <div className="flex flex-wrap items-center gap-3">
              {!isPending && (
                <VoteControls comment={comment} vote={actions.vote} own={own} />
              )}
              {!isPending && !replying && (
                <TextButton
                  type="button"
                  onClick={() =>
                    user ? setReplying(true) : actions.requireSignIn()
                  }
                >
                  Reply
                </TextButton>
              )}
              {isPending && user?.role === "admin" && (
                <>
                  <TextButton
                    type="button"
                    className={"text-success"}
                    onClick={() => actions.review(comment, "approve")}
                  >
                    Approve
                  </TextButton>
                  <TextButton
                    type="button"
                    className={"text-danger"}
                    onClick={() => actions.review(comment, "reject")}
                  >
                    Reject
                  </TextButton>
                </>
              )}
            </div>
            {replying && user && (
              <CommentComposer
                label={`Reply to ${comment.author.username}`}
                admin={user.role === "admin"}
                initialBody={isDeepest ? `@${comment.author.username} ` : ""}
                autoFocus
                onCancel={() => setReplying(false)}
                onSubmit={async (body) => {
                  await actions.submit(body, comment.id);
                  setReplying(false);
                }}
              />
            )}
            {replies.length > 0 && (
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    childrenByParent={childrenByParent}
                    actions={actions}
                    highlightedId={highlightedId}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </li>
  );
};

export const QuestionComments: FC<{
  questionBank: Exclude<QuestionBankName, "prep">;
  questionId: string;
}> = ({ questionBank, questionId }) => {
  const { status, user } = useAuth();
  const [comments, setComments] = useState<QuestionComment[]>();
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [signingIn, setSigningIn] = useState(false);
  const [sort, setSort] = useState<Sort>("top");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const userId = user?.id;

  useEffect(() => {
    if (status === "loading") return;
    let cancelled = false;
    fetchQuestionComments({ data: { questionBank, questionId } })
      .then((rows) => !cancelled && setComments(rows))
      .catch(() => !cancelled && setError("Could not load the comments."));
    return () => {
      cancelled = true;
    };
  }, [questionBank, questionId, status, userId]);

  const update = (id: string, change: Partial<QuestionComment> | null) =>
    setComments((current) =>
      current?.flatMap((comment) =>
        comment.id !== id ? comment : change ? { ...comment, ...change } : [],
      ),
    );

  const actions: Actions = {
    user,
    requireSignIn: () => setSigningIn(true),
    submit: async (body, parentId) => {
      const comment = await createQuestionComment({
        data: { questionBank, questionId, parentId, body },
      });
      setComments((current) => [...(current ?? []), comment]);
      setNotice(
        comment.status === "pending"
          ? cn(
              "Comment submitted. It is awaiting moderator approval and only you can see it until then.",
            )
          : "Comment posted.",
      );
      setHighlightedId(comment.id);
      setTimeout(() => setHighlightedId(null), 3000);
    },
    vote: (comment, value) => {
      if (!user) return setSigningIn(true);
      const previous = { myVote: comment.myVote, score: comment.score };
      update(comment.id, {
        myVote: value,
        score: comment.score + value - comment.myVote,
      });
      voteComment({ data: { commentId: comment.id, value } }).catch((cause) => {
        update(comment.id, previous);
        setError(
          cause instanceof Error && cause.message
            ? cause.message
            : "Could not save your vote.",
        );
      });
    },
    review: (comment, decision) => {
      const request =
        decision === "approve"
          ? { decision, commentId: comment.id, reply: null }
          : { decision, commentId: comment.id };
      reviewComment({ data: request })
        .then(() =>
          update(
            comment.id,
            decision === "approve" ? { status: "approved" } : null,
          ),
        )
        .catch(() => setError("Could not review that comment."));
    },
  };

  const sortedIds = useMemo(
    () =>
      new Map(
        [...(comments ?? [])]
          .sort(
            (x, y) =>
              Number(y.status === "pending") - Number(x.status === "pending") ||
              SORTERS[sort](x, y),
          )
          .map((c, i) => [c.id, i]),
      ),
    [sort, comments?.length],
  );
  const childrenByParent = useMemo(() => {
    const map = new Map<string, QuestionComment[]>();
    for (const comment of comments ?? []) {
      if (!comment.parentId) continue;
      map.set(comment.parentId, [
        ...(map.get(comment.parentId) ?? []),
        comment,
      ]);
    }
    for (const siblings of map.values()) {
      siblings.sort(
        (a, b) => (sortedIds.get(a.id) ?? 0) - (sortedIds.get(b.id) ?? 0),
      );
    }
    return map;
  }, [comments, sortedIds]);
  const rootComments = comments
    ?.filter((comment) => !comment.parentId)
    .sort((a, b) => (sortedIds.get(a.id) ?? 0) - (sortedIds.get(b.id) ?? 0));

  return (
    <div className="flex flex-col gap-6">
      {user ? (
        <CommentComposer
          label="Add a comment"
          admin={user.role === "admin"}
          onSubmit={(body) => actions.submit(body, null)}
        />
      ) : (
        <div className="flex items-center gap-3 text-sm text-muted">
          <Button
            disabled={status === "loading"}
            onClick={() => setSigningIn(true)}
          >
            Sign in
          </Button>
          to join the discussion.
        </div>
      )}
      {notice && (
        <p
          role="status"
          className="m-0 rounded-md bg-accent-soft p-2 text-xs text-accent"
        >
          {notice}
        </p>
      )}
      {error && <p className="m-0 text-sm text-danger">{error}</p>}
      {comments && (
        <div className="flex items-center justify-between">
          <p className="m-0 text-xs font-semibold text-muted">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </p>
          {comments.length > 1 && <SortMenu value={sort} onChange={setSort} />}
        </div>
      )}
      {rootComments?.length === 0 && (
        <p className="m-0 text-sm text-muted">
          No comments yet. Be the first to share something.
        </p>
      )}
      {rootComments && rootComments.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              childrenByParent={childrenByParent}
              actions={actions}
              highlightedId={highlightedId}
            />
          ))}
        </ul>
      )}
      {signingIn && !user && (
        <AccountModal onClose={() => setSigningIn(false)} />
      )}
    </div>
  );
};
