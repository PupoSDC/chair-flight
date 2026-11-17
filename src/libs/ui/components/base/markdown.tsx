import { useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { getHighlightRegExp } from "../../../base/get-highlight-reg-exp";
import { useSearchWords } from "../../hooks/use-search-words";
import { cn } from "../../utils/cn";
import { BuffetOnsetChart } from "../question-bank/annex-buffet-onset-chart";
import { AnnexModal } from "../question-bank/annex-modal";
import { MrjtLoadTrimSheet } from "../question-bank/annex-mrjt-load-trim-sheet";
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

const MarkdownImage: FC<{
  src?: string;
  alt?: string;
}> = ({ src = "", alt = "" }) => {
  const [expanded, setExpanded] = useState(false);
  const [file, query] = src.split("?");
  const buffet = file.endsWith("buffet-onset-boundary-chart.svg");
  if (!buffet && !file.endsWith("031-mrjt-load-trim-sheet.svg")) {
    return <img src={src} alt={alt} />;
  }
  const fields = Object.fromEntries(new URLSearchParams(query));
  return (
    <>
      <button
        type="button"
        aria-label="Expand annex"
        className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
        onClick={() => setExpanded(true)}
      >
        {buffet ? (
          <BuffetOnsetChart fields={fields} className="border border-rule" />
        ) : (
          <MrjtLoadTrimSheet fields={fields} className="border border-rule" />
        )}
      </button>
      {expanded &&
        createPortal(
          <AnnexModal href={src} onClose={() => setExpanded(false)} />,
          document.body,
        )}
    </>
  );
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
        components={{ img: MarkdownImage }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
