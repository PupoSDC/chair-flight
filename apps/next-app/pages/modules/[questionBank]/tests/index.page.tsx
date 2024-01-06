import * as fs from "node:fs/promises";
import { MissingPathParameter } from "@chair-flight/base/errors";
import {
  AppHead,
  LayoutModuleBank,
  TestsOverview,
} from "@chair-flight/react/containers";
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
  <LayoutModuleBank questionBank={questionBank}>
    <AppHead />
    <TestsOverview
      component={"section"}
      sx={{ mx: "auto", maxWidth: "lg", width: "100%" }}
      questionBank={questionBank}
    />
  </LayoutModuleBank>
);

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    const questionBank = params.questionBank;
    if (!questionBank) throw new MissingPathParameter("questionBank");

    await Promise.all([helper.questionBank.getConfig.fetch(params)]);

    return { props: { questionBank } };
  },
  fs,
);

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const banks: QuestionBankName[] = ["b737", "a320", "atpl", "prep"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default Page;
