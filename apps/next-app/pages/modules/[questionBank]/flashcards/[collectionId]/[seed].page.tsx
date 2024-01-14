import { MissingPathParameter } from "@chair-flight/base/errors";
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
    const questionBank = params?.questionBank;
    const collectionId = params?.seed;
    const seed = params?.seed ?? "start";
    if (!questionBank) throw new MissingPathParameter("questionBank");
    if (!collectionId) throw new MissingPathParameter("collectionId");
    if (!seed) throw new MissingPathParameter("seed");

    if (seed === "start") {
      const randomId = getRandomId();
      return {
        redirect: {
          permanent: false,
          destination: `/modules/prep/flashcards/${collectionId}/${randomId}`,
        },
      };
    }

    await Promise.all([
      LayoutModule.getData({ helper, params }),
      FlashcardTest.getData({ helper, params }),
    ]);

    return {
      props: {
        seed,
        collectionId,
        questionBank,
      },
    };
  },
);

export default Page;
