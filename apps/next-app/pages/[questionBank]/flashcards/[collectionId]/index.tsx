import * as fs from "node:fs/promises";
import { AppHead } from "@cf/next-old/public";
import { FlashcardList, LayoutModule } from "@cf/next-old/question-bank";
import { staticHandler, staticPathsHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { Breadcrumbs } from "@cf/next-old/question-bank";
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
    <LayoutModule questionBank={questionBank} breadcrumbs={crumbs}>
      <AppHead />
      <FlashcardList
        sx={{ maxWidth: "lg", width: "100%", margin: "auto" }}
        questionBank={questionBank}
        collectionId={collectionId}
      />
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
    const modules = helper.pageGeneration.modules;
    const getPaths = modules.getFlashcardsGenerationPaths;
    const { paths } = await getPaths.fetch();
    return { fallback: false, paths };
  },
  fs,
);

export default Page;
