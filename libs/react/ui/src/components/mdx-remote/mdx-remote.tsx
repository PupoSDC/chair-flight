import { cntl } from "@cf/base/utils";
import type { MDXRemoteProps } from "@daviereid/next-mdx-remote/rsc";
import { FunctionComponent, HTMLAttributes } from "react";
import { default as rehypeKatex } from "rehype-katex";
import { default as remarkGemoji } from "remark-gemoji";
import { default as remarkGfm } from "remark-gfm";
import { default as remarkMath } from "remark-math";
import { default as remarkSupersub } from "remark-supersub";
import { twMerge } from "tailwind-merge";

export type MdxRemoteProps = {
  source: MDXRemoteProps["source"];
  components?: MDXRemoteProps["components"];
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Server component :) 
 */
export const MdxRemote: FunctionComponent<MdxRemoteProps> = async ({
  source,
  components,
  ...props
}) => {
  // Loading this library in the conventional way causes the whole app to 
  // crash. Good news, this makes it clear this is a Server Component :) 
  const ActualMdxRemote = await import("@daviereid/next-mdx-remote/rsc")
    .then(m => m.MDXRemote);

  return (
    <div
      {...props}
      className={twMerge(cntl`
        [&_h1]:text-3xl
        [&_h1]:font-bold
        [&_h1]:text-neutral-900
        [&_h1]:dark:text-neutral-50
        [&_h1]:pt-4
        [&_h1]:pb-2
        [&_h1:first]:pt-0

        [&_h2]:text-2xl
        [&_h2]:semi-bold
        [&_h2]:text-neutral-900
        [&_h2]:dark:text-neutral-50
        [&_h2]:pt-4
        [&_h2]:pb-2
        [&_h2:first]:pt-0
        
        [&_h3]:text-xl
        [&_h3]:semi-bold
        [&_h3]:text-neutral-900
        [&_h3]:dark:text-neutral-50
        [&_h3]:pt-4
        [&_h3]:pb-2
        [&_h3:first]:pt-0

        [&_h4]:text-xl
        [&_h4]:semi-bold
        [&_h4]:text-neutral-900
        [&_h4]:dark:text-neutral-50
        [&_h4]:pt-4
        [&_h4]:pb-2
        [&_h4:first]:pt-0    
        
      `, props.className)}
    >
      <ActualMdxRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [
              [remarkGfm, { singleTilde: false }],
              remarkMath,
              remarkGemoji,
              remarkSupersub,
            ],
            rehypePlugins: [
              rehypeKatex
            ],
          },
        }}
      />
    </div>
  );
}