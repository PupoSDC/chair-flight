import { memo } from "react";
import { default as ReactMarkdown } from "react-markdown";
import { default as remarkGemoji } from "remark-gemoji";
import { default as remarkGfm } from "remark-gfm";
import { default as remarkSupersub } from "remark-supersub";
import type { Options } from "react-markdown";

export type MarkdownClientProps = {
  children: string;
  className?: Options["className"];
};

export const MarkdownClient = memo<MarkdownClientProps>((props) => (
  <ReactMarkdown
    {...props}
    remarkPlugins={[
      [remarkGfm, { singleTilde: false }],
      remarkGemoji,
      remarkSupersub,
    ]}
  />
));

MarkdownClient.displayName = "MarkdownClient";
