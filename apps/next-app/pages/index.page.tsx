import * as fs from "node:fs/promises";
import {
  AppHead,
  BackgroundSlidingImages,
} from "@chair-flight/react/components";
import { LayoutPublic, OverviewWelcome } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

export const Page: NextPage = () => (
  <LayoutPublic fixedHeight noPadding background={<BackgroundSlidingImages />}>
    <AppHead />
    <OverviewWelcome />
  </LayoutPublic>
);

export const getStaticProps = staticHandler(async ({ helper }) => {
  await OverviewWelcome.getData({ helper, params: {} });
  return { props: {} };
}, fs);

export default Page;
