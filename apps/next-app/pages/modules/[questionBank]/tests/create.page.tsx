import * as fs from "node:fs/promises";
import { useRouter } from "next/router";
import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, TestMaker } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { GetStaticPaths, NextPage } from "next";

type PageProps = {
  questionBank: QuestionBankName;
};

type PageParams = {
  questionBank: QuestionBankName;
};

const Page: NextPage<PageProps> = ({ questionBank }) => {
  const router = useRouter();

  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Tests", `/modules/${questionBank}/tests`],
    "Create",
  ] as Breadcrumbs;

  return (
    <LayoutModule questionBank={questionBank} breadcrumbs={crumbs} fixedHeight>
      <AppHead />
      <TestMaker
        noSsr
        questionBank={questionBank}
        sx={{ height: "100%", overflow: "hidden" }}
        onSuccessfulTestCreation={async (test) =>
          router.push(`/modules/${questionBank}/tests/${test.id}/${test.mode}`)
        }
      />
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ helper, params });
    await TestMaker.getData({ helper, params });
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
