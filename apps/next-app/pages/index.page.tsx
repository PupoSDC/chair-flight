import * as fs from "node:fs/promises";
import { useState } from "react";
import { LayoutPublic, HeroWelcome } from "@chair-flight/next/public";
import {
  AppHead,
  BackgroundSlidingImages,
} from "@chair-flight/react/components";
import { ThemeOverrideColorScheme } from "@chair-flight/react/theme";
import { staticHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
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
      <HeroWelcome
        headerHeight={48}
        questionBank={questionBank}
        onQuestionBankChanged={setQuestionBank}
      />
    </LayoutPublic>
  );
};

export const getStaticProps = staticHandler(async ({ helper }) => {
  await HeroWelcome.getData({ helper, params: {} });
  return { props: {} };
}, fs);

export default Page;
