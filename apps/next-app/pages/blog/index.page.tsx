import * as fs from "node:fs/promises";
import { AppHead, BackgroundFadedImage } from "@chair-flight/react/components";
import { BlogIndex, LayoutPublic } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
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
