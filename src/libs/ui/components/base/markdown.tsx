import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../../utils/cn";
import { getHighlightRegExp, useSearchWords } from "./search-highlight";
import type { FC } from "react";

type HastNode = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const markNode = (pattern: RegExp, node: HastNode): HastNode[] => {
  if (node.type === "text" && node.value) {
    return node.value.split(pattern).map((part, index) =>
      index % 2 === 1
        ? {
            type: "element",
            tagName: "mark",
            properties: { className: ["search-mark"] },
            children: [{ type: "text", value: part }],
          }
        : { type: "text", value: part },
    );
  }
  if (node.children && node.tagName !== "code") {
    node.children = node.children.flatMap((child) => markNode(pattern, child));
  }
  return [node];
};

const rehypeHighlight = (words: string[]) => () => (tree: HastNode) => {
  const pattern = getHighlightRegExp(words);
  if (!pattern) return;
  tree.children = tree.children?.flatMap((child) => markNode(pattern, child));
};

export const Markdown: FC<{
  children: string;
  className?: string;
}> = ({ children, className }) => {
  const words = useSearchWords();
  return (
    <div className={cn("markdown", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={words.length > 0 ? [rehypeHighlight(words)] : []}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
