import { Stack } from "@mui/joy";
import type { MDXRemoteProps } from "@daviereid/next-mdx-remote/rsc";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type MdxRemoteProps = {
  source: string;
  components?: MDXRemoteProps["components"];
} & Omit<StackProps, "children">;

export const MdxRemote: FunctionComponent<MdxRemoteProps> = async ({
  source,
  components,
  ...props
}) => {
  const MATCH_CODE_BLOCKS = /```tsx eval((?:.|\n)*?)```/g;

  // Loading the library like this keeps the outside the client component bundle
  const remarkGfm = await import("remark-gfm").then((m) => m.default);
  const remarkMath = await import("remark-math").then((m) => m.default);
  const remarkGemoji = await import("remark-gemoji").then((m) => m.default);
  const remarkSupersub = await import("remark-supersub").then((m) => m.default);
  const rehypeKatex = await import("rehype-katex").then((m) => m.default);
  const ActualMdxRemote = await import("@daviereid/next-mdx-remote/rsc").then(
    (m) => m.MDXRemote,
  );

  return (
    <Stack {...props}>
      <ActualMdxRemote
        source={source.replaceAll(MATCH_CODE_BLOCKS, "$1")}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [
              [remarkGfm, { singleTilde: false }],
              remarkMath,
              remarkGemoji,
              remarkSupersub,
            ],
            rehypePlugins: [rehypeKatex],
          },
        }}
      />
    </Stack>
  );
};
