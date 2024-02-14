import type { PluggableList } from "@mdx-js/mdx/lib/core";
import { default as rehypeKatex } from "rehype-katex";
import { default as remarkGemoji } from "remark-gemoji";
import { default as remarkGfm } from "remark-gfm";
import { default as remarkMath } from "remark-math";
import { default as remarkSupersub } from "remark-supersub";

export const markdownPlugins = {
  remarkPlugins: [
    [remarkGfm, { singleTilde: false }],
    remarkMath,
    remarkGemoji,
    remarkSupersub,
  ] as PluggableList,
  rehypePlugins: [rehypeKatex] as PluggableList,
};
