import { default as rehypeKatex } from "rehype-katex";
import { default as remarkGemoji } from "remark-gemoji";
import { default as remarkGfm } from "remark-gfm";
import { default as remarkMath } from "remark-math";
import { default as remarkSupersub } from "remark-supersub";

export const plugins = {
  remarkPlugins: [remarkMath, remarkGemoji, remarkSupersub, remarkGfm],
  rehypePlugins: [rehypeKatex],
};
