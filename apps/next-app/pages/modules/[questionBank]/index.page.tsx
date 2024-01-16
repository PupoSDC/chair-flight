import * as fs from "node:fs/promises";
import { Divider, Link, Typography } from "@mui/joy";
import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, OverviewModules } from "@chair-flight/react/containers";
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
  <LayoutModule questionBank={questionBank}>
    <AppHead />
    <Typography level="h2">Question Bank</Typography>
    <Divider />
    <OverviewModules questionBank={questionBank} sx={{ my: 2 }} />
    <Typography level="h2">Tests</Typography>
    <Divider sx={{ mb: 2 }} />
    <Link href={`/modules/${questionBank}/tests/create`}>Create New Test</Link>
  </LayoutModule>
);

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await OverviewModules.getData({ helper, params });
    await LayoutModule.getData({ helper, params });
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
