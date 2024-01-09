import * as fs from "node:fs/promises";
import { AppHead, CoolSlidingThing } from "@chair-flight/react/components";
import { LayoutPublic, Welcome } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

export const Page: NextPage = () => (
  <LayoutPublic fixedHeight noPadding background={<CoolSlidingThing />}>
    <AppHead />
    <Welcome />
  </LayoutPublic>
);

export const getStaticProps = staticHandler(async (params) => {
  await Welcome.getData(params);
  return { props: {} };
}, fs);

export default Page;
