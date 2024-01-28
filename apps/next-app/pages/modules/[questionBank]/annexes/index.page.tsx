import * as fs from "node:fs/promises";
import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, AnnexSearch } from "@chair-flight/react/containers";
import { staticHandler, staticPathsHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { Breadcrumbs } from "@chair-flight/react/containers";
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
