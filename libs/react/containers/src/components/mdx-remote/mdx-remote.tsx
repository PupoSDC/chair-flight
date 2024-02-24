import { markdownPlugins } from "@cf/core/markdown";
import { markdownComponents } from "@cf/react/markdown";
import { MDXComponents } from "@mdx-js/react/lib";
import { FunctionComponent } from "react";

export type MdxRemoteProps = {
    source: string;
    components?: Readonly<MDXComponents>;
}

export const MdxRemote: FunctionComponent<MdxRemoteProps> = async ({
    source,
    components,
}) => {
    // Loading this library in the conventional way causes the whole app to 
    // crash. Good news, this makes it clear this is a Server Component :) 
    const ActualMdxRemote = await import("@daviereid/next-mdx-remote/rsc")
        .then(m => m.MDXRemote);
    return (
        <ActualMdxRemote
            source={source}
            components={{ ...markdownComponents, ...components }}
            options={{
                mdxOptions: {
                    remarkPlugins: markdownPlugins.remarkPlugins,
                    rehypePlugins: markdownPlugins.rehypePlugins,
                },
            }}
        />
    );
}