import * as fs from "node:fs/promises";
import { AppHead } from "@chair-flight/react/components";
import {
  LayoutModule,
  LearningObjectivesSearch,
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

export const Page: NextPage<PageProps, PageParams> = (props) => (
  <LayoutModule fixedHeight {...props}>
    <AppHead />
    <LearningObjectivesSearch {...props} />
  </LayoutModule>
);

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ params, helper });
    await LearningObjectivesSearch.getData({ params, helper });
    return { props: params };
  },
  fs,
);

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  return {
    paths: [{ params: { questionBank: "atpl" } }],
    fallback: false,
  };
};

export default Page;
