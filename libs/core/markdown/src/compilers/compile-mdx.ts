import { compile } from "@mdx-js/mdx";
import { markdownPlugins } from "../common/plugins";

const MATCH_CODE_BLOCKS = /```tsx eval((?:.|\n)*?)```/g;

/**
 * A convenience type that represents MDX documents.
 */
export type MdxDocument = {
  mdxContent: string;
};

export const compileMdx = async (text: string): Promise<MdxDocument> => {
  const sourceString = text.replaceAll(MATCH_CODE_BLOCKS, "$1");

  const mdxContent = await compile(sourceString, {
    outputFormat: "function-body",
    providerImportSource: "@mdx-js/react",
    ...markdownPlugins,
  }).then(String);

  return { mdxContent };
};
