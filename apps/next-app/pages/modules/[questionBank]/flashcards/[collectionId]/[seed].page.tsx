import { getRandomId } from "@chair-flight/core/app";
import { AppHead } from "@chair-flight/react/components";
import { FlashcardTest, LayoutModule } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type PageProps = {
  questionBank: QuestionBankName;
  collectionId: string;
  seed: string;
};

type PageParams = {
  questionBank: QuestionBankName;
  collectionId: string;
  seed: string;
};

const Page: NextPage<PageProps> = ({ questionBank, collectionId, seed }) => {
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Flashcards", `/modules/${questionBank}/flashcards`],
    collectionId,
  ] as Breadcrumbs;

  return (
    <LayoutModule questionBank={questionBank} breadcrumbs={crumbs} fixedHeight>
      <AppHead />
      <FlashcardTest
        questionBank={questionBank}
        collectionId={collectionId}
        seed={seed}
      />
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ helper, params }) => {
    const questionBank = params.questionBank;
    const collectionId = params?.collectionId;
    const seed = params?.seed;

    if (seed === "start") {
      const randomId = getRandomId();
      return {
        redirect: {
          permanent: false,
          destination: `/modules/${questionBank}/flashcards/${collectionId}/${randomId}`,
        },
      };
    }

    await Promise.all([
      LayoutModule.getData({ helper, params }),
      FlashcardTest.getData({ helper, params }),
    ]);

    return { props: params };
  },
);

export default Page;
