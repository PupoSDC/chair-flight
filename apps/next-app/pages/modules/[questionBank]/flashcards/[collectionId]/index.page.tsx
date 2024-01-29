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
