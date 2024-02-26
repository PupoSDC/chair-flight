import * as fs from "node:fs/promises";
import { useState } from "react";
import { LayoutPublic, HeroWelcome, AppHead } from "@cf/next/public";
import { ThemeOverrideColorScheme } from "@cf/react/theme";
import { BackgroundSlidingImages } from "@cf/react/ui";
import { staticHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
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
