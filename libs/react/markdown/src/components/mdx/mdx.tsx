import { useMemo } from "react";
import * as mdx from "@mdx-js/react";
import { Box } from "@mui/joy";
import { markdownComponents } from "../../common/components";
import type { MdxDocument } from "@cf/core/markdown";
import type { BoxProps } from "@mui/joy";
import type { ComponentProps, FunctionComponent } from "react";

export type MdxComponents = ComponentProps<
  typeof mdx.MDXProvider
>["components"];

let jsxRuntime: Record<string, unknown> = {};
if (process.env["NODE_ENV"] === "development") {
  jsxRuntime = require("react/jsx-dev-runtime") || {};
  jsxRuntime["jsxs"] = jsxRuntime["jsxs"] ?? null;
  jsxRuntime["jsxsDEV"] = jsxRuntime["jsxsDEV"] ?? null;
  jsxRuntime["jsx"] = jsxRuntime["jsx"] ?? null;
  jsxRuntime["jsxDev"] = jsxRuntime["jsxDev"] ?? null;
} else {
  jsxRuntime = require("react/jsx-runtime") || {};
  jsxRuntime["jsxs"] = jsxRuntime["jsxs"] || null;
  jsxRuntime["jsxsDEV"] = jsxRuntime["jsxsDEV"] || null;
  jsxRuntime["jsx"] = jsxRuntime["jsx"] || null;
  jsxRuntime["jsxDev"] = jsxRuntime["jsxDev"] || null;
}

export type MdxProps = {
  children: MdxDocument;
  components?: MdxComponents;
} & Omit<BoxProps, "children">;

/**
 * Renders **mdx** previously compiled on the server.
 *
 * This code is essentially a hard fork of
 * [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) that supports
 * MDX@3 and the whole new generation of plugins.
 */
export const Mdx: FunctionComponent<MdxProps> = ({
  children,
  components,
  ...props
}) => {
  const Content: React.ElementType = useMemo(() => {
    const fullScope = Object.assign({
      opts: {
        ...mdx,
        ...jsxRuntime,
        jsxs: jsxRuntime["jsxs"] ?? jsxRuntime["jsxDEV"],
        jsx: jsxRuntime["jsx"] || jsxRuntime["jsxDEV"],
      },
    });

    const keys = Object.keys(fullScope);
    const values = Object.values(fullScope);

    const hydrateFn = Reflect.construct(
      Function,
      keys.concat(`${children.mdxContent}`),
    );

    return hydrateFn.apply(hydrateFn, values).default;
  }, [children.mdxContent]);

  return (
    <Box {...props}>
      <mdx.MDXProvider components={{ ...markdownComponents, ...components }}>
        <Content />
      </mdx.MDXProvider>
    </Box>
  );
};
