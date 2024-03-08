import * as fs from "node:fs/promises";
import { MissingPathParameter } from "@cf/base/errors";
import { AppHead } from "@cf/next-old/public";
import { LayoutModule } from "@cf/next-old/question-bank";
import { UserSettings } from "@cf/next-old/user";
import { staticHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { Breadcrumbs } from "@cf/next-old/question-bank";
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
    "Settings",
  ] as Breadcrumbs;

  return (
    <LayoutModule questionBank={questionBank} breadcrumbs={crumbs}>
      <AppHead />
      <UserSettings />
    </LayoutModule>
  );
};

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
  const banks: QuestionBankName[] = ["type", "atpl", "prep"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default Page;
