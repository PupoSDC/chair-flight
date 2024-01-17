import * as fs from "node:fs/promises";
import { useState } from "react";
import {
  AppHead,
  BackgroundSlidingImages,
  ThemeOverrideColorScheme,
} from "@chair-flight/react/components";
import { LayoutPublic, OverviewWelcome } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { NextPage } from "next";

export const Page: NextPage = () => {
  const [questionBank, setQuestionBank] = useState<QuestionBankName>();
  return (
    <LayoutPublic
      fixedHeight
      noPadding
      background={<BackgroundSlidingImages />}
    >
      <ThemeOverrideColorScheme questionBank={questionBank} />
      <AppHead />
      <OverviewWelcome
        headerHeight={48}
        questionBank={questionBank}
        onQuestionBankChanged={setQuestionBank}
      />
    </LayoutPublic>
  );
};

export const getStaticProps = staticHandler(async ({ helper }) => {
  await OverviewWelcome.getData({ helper, params: {} });
  return { props: {} };
}, fs);

export default Page;
