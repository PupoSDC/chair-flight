import { compile } from "@mdx-js/mdx";
import { default as rehypeKatex } from "rehype-katex";
import { default as remarkGemoji } from "remark-gemoji";
import { default as remarkGfm } from "remark-gfm";
import { default as remarkMath } from "remark-math";
import { default as remarkSupersub } from "remark-supersub";
import type { MdxDocument } from "@chair-flight/base/types";

/**
 * Our MDX is actually Markdown files since thesse provide
 * better prettier support. Limited MDX support is provided
 * by means of escaping executable code blocks with
 *
 * ```tsx eval
 * <SomeCustomComponent />
 * ```
 */
const MATCH_CODE_BLOCKS = /```tsx eval((?:.|\n)*?)```/g;

export const compileMdx = async (text: string): Promise<MdxDocument> => {
  const sourceString = text.replaceAll(MATCH_CODE_BLOCKS, "$1");

  const content = await compile(sourceString, {
    outputFormat: "function-body",
    providerImportSource: "@mdx-js/react",
    remarkPlugins: [remarkMath, remarkGemoji, remarkSupersub, remarkGfm],
    rehypePlugins: [rehypeKatex],
  }).then(String);

  return { content };
};
