import { default as ReactMarkdown } from "react-markdown";
import { default as remarkGemoji } from "remark-gemoji";
import { default as remarkGfm } from "remark-gfm";
import { default as remarkSupersub } from "remark-supersub";
import type { FunctionComponent } from "react";

export type MarkdownClientProps = {
  children: string;
};

export const MarkdownClient: FunctionComponent<MarkdownClientProps> = ({
  children,
}) => (
  <ReactMarkdown
    remarkPlugins={[
      [remarkGfm, { singleTilde: false }],
      remarkGemoji,
      remarkSupersub,
    ]}
  >
    {children}
  </ReactMarkdown>
);
