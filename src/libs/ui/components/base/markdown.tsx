import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { getHighlightRegExp } from "../../../base/get-highlight-reg-exp";
import { useSearchWords } from "../../hooks/use-search-words";
import { cn } from "../../utils/cn";
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
  if (node.children && node.tagName !== "code" && node.tagName !== "math") {
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
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          ...(words.length > 0 ? [rehypeHighlight(words)] : []),
          rehypeKatex,
        ]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
