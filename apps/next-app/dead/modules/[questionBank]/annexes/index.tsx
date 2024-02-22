import * as fs from "node:fs/promises";
import { AppHead } from "@cf/next/public";
import { LayoutModule, AnnexSearch } from "@cf/next/question-bank";
import { staticHandler, staticPathsHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { Breadcrumbs } from "@cf/next/question-bank";
import type { NextPage } from "next";

type PageProps = {
  questionBank: QuestionBankName;
};

type PageParams = {
  questionBank: QuestionBankName;
};

const Page: NextPage<PageProps> = ({ questionBank }) => {
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    "Annexes",
  ] as Breadcrumbs;

  return (
    <LayoutModule fixedHeight questionBank={questionBank} breadcrumbs={crumbs}>
      <AppHead />
      <AnnexSearch questionBank={questionBank} sx={{ height: "100%" }} />
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ helper, params });
    await AnnexSearch.getData({ helper, params });
    return { props: params };
  },
  fs,
);

export const getStaticPaths = staticPathsHandler<PageParams>(
  async ({ helper }) => {
    const getPaths = helper.pageGeneration.modules.getIndexGenerationPaths;
    const paths = await getPaths.fetch({ resource: "annexes" });
    return { fallback: false, paths };
  },
  fs,
);

export default Page;
