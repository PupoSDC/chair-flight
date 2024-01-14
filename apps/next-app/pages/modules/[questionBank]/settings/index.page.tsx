import * as fs from "node:fs/promises";
import { MissingPathParameter } from "@chair-flight/base/errors";
import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, UserSettings } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { GetStaticPaths, NextPage } from "next";

type PageProps = {
  questionBank: QuestionBankName;
};

type PageParams = {
  questionBank: QuestionBankName;
};

const Page: NextPage<PageProps> = ({ questionBank }) => (
  <LayoutModule questionBank={questionBank} fixedHeight>
    <AppHead />
    <UserSettings />
  </LayoutModule>
);

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    const questionBank = params.questionBank;
    if (!questionBank) throw new MissingPathParameter("questionBank");
    await LayoutModule.getData({ helper, params });
    await UserSettings.getData({ helper, params });
    return { props: params };
  },
  fs,
);

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const banks: QuestionBankName[] = ["b737", "a320", "atpl", "prep"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default Page;
