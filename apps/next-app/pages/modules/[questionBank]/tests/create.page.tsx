import * as fs from "node:fs/promises";
import { useRouter } from "next/router";
import { MissingPathParameter } from "@chair-flight/base/errors";
import {
  AppHead,
  LayoutModule,
  TestMaker,
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

const Page: NextPage<PageProps> = ({ questionBank }) => {
  const router = useRouter();

  return (
    <LayoutModule questionBank={questionBank} fixedHeight>
      <AppHead />
      <TestMaker
        component="section"
        questionBank={questionBank}
        sx={{ height: "100%" }}
        onSuccessfulTestCreation={(test) =>
          router.push(`/modules/${questionBank}/tests/${test.id}/${test.mode}`)
        }
      />
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    const questionBank = params?.questionBank;
    if (!questionBank) throw new MissingPathParameter("questionBank");
    await LayoutModule.getData({ helper, params });

    await Promise.all([
      helper.questionBank.getConfig.fetch(params),
      helper.questionBank.getAllSubjects.fetch(params),
    ]);

    return { props: { questionBank } };
  },
  fs,
);

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const banks: QuestionBankName[] = ["b737", "a320", "atpl"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default Page;
