import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../../utils/cn";
import type { FC } from "react";

const DISALLOWED_ELEMENTS = ["img", "h1", "h2", "h3", "h4", "h5", "h6"];

export const CommentMarkdown: FC<{
  children: string;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn(
      "markdown text-sm wrap-break-word [&>:first-child]:mt-0",
      "[&>:last-child]:mb-0",
      className,
    )}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      disallowedElements={DISALLOWED_ELEMENTS}
      unwrapDisallowed
      components={{
        a: ({ node: _node, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
          />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);
