import * as fs from "node:fs/promises";
import { AppHead } from "@chair-flight/react/components";
import { FlashcardList, LayoutModule } from "@chair-flight/react/containers";
import { staticHandler, staticPathsHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type PageProps = {
  questionBank: QuestionBankName;
  collectionId: string;
};

type PageParams = {
  questionBank: QuestionBankName;
  collectionId: string;
};

const Page: NextPage<PageProps> = ({ questionBank, collectionId }) => {
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Flashcards", `/modules/${questionBank}/flashcards`],
    collectionId,
  ] as Breadcrumbs;

  return (
    <LayoutModule noPadding questionBank={questionBank} breadcrumbs={crumbs}>
      <AppHead />
      <FlashcardList questionBank={questionBank} collectionId={collectionId} />
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ params, helper });
    await FlashcardList.getData({ params, helper });
    return { props: params };
  },
  fs,
);

export const getStaticPaths = staticPathsHandler<PageParams>(
  async ({ helper }) => {
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
  },
  fs,
);

export default Page;
