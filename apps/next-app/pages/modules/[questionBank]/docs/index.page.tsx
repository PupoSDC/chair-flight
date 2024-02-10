import * as fs from "node:fs/promises";
import { DocSearch, LayoutModule } from "@chair-flight/next/question-bank";
import { AppHead } from "@chair-flight/react/components";
import { staticHandler, staticPathsHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { Breadcrumbs } from "@chair-flight/next/question-bank";
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
    "Docs",
  ] as Breadcrumbs;

  return (
    <LayoutModule fixedHeight questionBank={questionBank} breadcrumbs={crumbs}>
      <AppHead />
      <DocSearch questionBank={questionBank} sx={{ height: "100%" }} />
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ helper, params });
    await DocSearch.getData({ helper, params });
    return { props: params };
  },
  fs,
);

export const getStaticPaths = staticPathsHandler<PageParams>(
  async ({ helper }) => {
    const getPaths = helper.pageGeneration.modules.getIndexGenerationPaths;
    const paths = await getPaths.fetch({ resource: "docs" });
    return { fallback: false, paths };
  },
  fs,
);
export default Page;
