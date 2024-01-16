import * as fs from "node:fs/promises";
import { getTrpcHelper } from "libs/trpc/server/src/next/trpc-helper";
import { AppHead } from "@chair-flight/react/components";
import { FlashcardList, LayoutModule } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { GetStaticPaths, NextPage } from "next";

type PageProps = {
  questionBank: QuestionBankName;
  collectionId: string;
};

type PageParams = {
  questionBank: QuestionBankName;
  collectionId: string;
};

const FlashcardsThemePage: NextPage<PageProps> = (props) => (
  <LayoutModule noPadding {...props}>
    <AppHead />
    <FlashcardList {...props} />
  </LayoutModule>
);

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ params, helper });
    await FlashcardList.getData({ params, helper });
    return { props: params };
  },
  fs,
);

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const helper = await getTrpcHelper();
  const qb = helper.questionBank;
  const banks: QuestionBankName[] = ["prep"];
  const paths = await Promise.all(
    banks.map(async (questionBank) => {
      const params = { questionBank };
      const data = await qb.getFlashcardsCollections.fetch(params);
      return data.collections.map(({ id: collectionId }) => ({
        params: {
          questionBank,
          collectionId,
        },
      }));
    }),
  ).then((c) => c.flat());
  return { fallback: false, paths };
};

export default FlashcardsThemePage;
