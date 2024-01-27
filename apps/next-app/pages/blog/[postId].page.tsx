import * as fs from "node:fs/promises";
import { BackgroundFadedImage } from "@chair-flight/react/components";
import { BlogPost, LayoutPublic } from "@chair-flight/react/containers";
import { staticHandler, staticPathsHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

type PageParams = { postId: string };
type PageProps = PageParams;

export const Page: NextPage<PageProps> = (props) => {
  return (
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <BlogPost {...props} />
    </LayoutPublic>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await BlogPost.getData({ helper, params });
    await LayoutPublic.getData({ helper, params });
    return { props: params };
  },
  fs,
);

export const getStaticPaths = staticPathsHandler<PageParams>(
  async ({ helper }) => {
    const { meta } = await helper.blog.getBlogPostsMeta.fetch();
    const paths = meta.map((meta) => ({ params: { postId: meta.filename } }));
    return { fallback: false, paths };
  },
  fs,
);

export default Page;
