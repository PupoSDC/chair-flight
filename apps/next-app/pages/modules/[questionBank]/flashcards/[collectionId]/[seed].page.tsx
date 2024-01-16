import { getRandomId } from "@chair-flight/core/app";
import { AppHead } from "@chair-flight/react/components";
import { FlashcardTest, LayoutModule } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
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

const Page: NextPage<PageProps> = ({ questionBank, collectionId, seed }) => (
  <LayoutModule questionBank={questionBank} fixedHeight>
    <AppHead />
    <FlashcardTest
      questionBank={questionBank}
      collectionId={collectionId}
      seed={seed}
    />
  </LayoutModule>
);

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
