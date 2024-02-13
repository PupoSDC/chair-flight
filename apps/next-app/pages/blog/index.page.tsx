import * as fs from "node:fs/promises";
import { BlogIndex, LayoutPublic } from "@cf/next/public";
import { AppHead, BackgroundFadedImage } from "@cf/react/components";
import { staticHandler } from "@cf/trpc/server";
import type { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <AppHead />
      <BlogIndex />
    </LayoutPublic>
  );
};

export const getStaticProps = staticHandler(async ({ helper }) => {
  await BlogIndex.getData({ params: {}, helper });
  return { props: {} };
}, fs);

export default Page;
