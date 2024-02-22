import * as fs from "node:fs/promises";
import { AppHead } from "@cf/next/public";
import { LayoutModule, QuestionEditorManager } from "@cf/next/question-bank";
import { staticHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { Breadcrumbs } from "@cf/next/question-bank";
import type { GetStaticPaths, NextPage } from "next";

type PageProps = {
  questionBank: QuestionBankName;
};

type PageParams = {
  questionBank: QuestionBankName;
};

const Page: NextPage<PageProps> = ({ questionBank }) => {
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Questions", `/modules/${questionBank}/questions`],
    "Editor",
  ] as Breadcrumbs;

  return (
    <LayoutModule questionBank={questionBank} breadcrumbs={crumbs} fixedHeight>
      <AppHead />
      <QuestionEditorManager
        noSsr
        questionBank={questionBank}
        sx={{ height: "100%" }}
      />
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ helper, params });
    await QuestionEditorManager.getData({ helper, params });
    return { props: params };
  },
  fs,
);

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const banks: QuestionBankName[] = ["type", "atpl"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default Page;
