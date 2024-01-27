import { useMemo } from "react";
import * as mdx from "@mdx-js/react";
import { jsxRuntime } from "./jsx-runtime.cjs";
import { markdownComponents } from "./markdown-components";
import type { MdxComponents } from "./markdown-components";
import type { FunctionComponent } from "react";

export type MdxDocument = {
  content: string;
};

export type MarkdownProps = {
  document: MdxDocument;
  components?: MdxComponents;
};

/**
 *
 * This code is essentially a hard fork of https://github.com/hashicorp/next-mdx-remote
 * but supports MDX@3 and the whole new generation of plugins.
 */
export const Markdown: FunctionComponent<MarkdownProps> = ({
  document,
  components,
}) => {
  const Content: React.ElementType = useMemo(() => {
    const fullScope = Object.assign({
      opts: {
        ...mdx,
        ...jsxRuntime,
        jsxs: jsxRuntime.jsxs || jsxRuntime.jsxDEV,
        jsx: jsxRuntime.jsx || jsxRuntime.jsxDEV,
      },
    });

    const keys = Object.keys(fullScope);
    const values = Object.values(fullScope);

    const hydrateFn = Reflect.construct(
      Function,
      keys.concat(`${document.content}`),
    );

    return hydrateFn.apply(hydrateFn, values).default;
  }, [document.content]);

  return (
    <mdx.MDXProvider components={{ ...markdownComponents, ...components }}>
      <Content />
    </mdx.MDXProvider>
  );
};
