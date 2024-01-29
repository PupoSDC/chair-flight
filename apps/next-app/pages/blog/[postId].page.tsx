import * as fs from "node:fs/promises";
import { AppHead, BackgroundFadedImage } from "@chair-flight/react/components";
import { BlogPost, LayoutPublic } from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { staticHandler, staticPathsHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

type PageParams = { postId: string };
type PageProps = PageParams;

export const Page: NextPage<PageProps> = ({ postId }) => {
  const postMeta = trpc.pageGeneration.blog.getBlogPostMeta;
  const [{ meta }] = postMeta.useSuspenseQuery({ postId });
  return (
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <AppHead
        title={meta.title}
        linkTitle={meta.title}
        linkDescription={meta.description}
      />
      <BlogPost postId={postId} />
    </LayoutPublic>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    const postId = params.postId;
    await helper.pageGeneration.blog.getBlogPostMeta.fetch({ postId });
    await BlogPost.getData({ helper, params });
    await LayoutPublic.getData({ helper, params });
    return { props: params };
  },
  fs,
);

export const getStaticPaths = staticPathsHandler<PageParams>(
  async ({ helper }) => {
    const getPaths = helper.pageGeneration.blog.getBlogPostGenerationPaths;
    const paths = await getPaths.fetch();
    return { fallback: false, paths };
  },
  fs,
);

export default Page;
