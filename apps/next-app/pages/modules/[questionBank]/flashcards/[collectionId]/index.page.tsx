import * as fs from "node:fs/promises";
import { useState } from "react";
import { Grid } from "@mui/joy";
import { getTrpcHelper } from "libs/trpc/server/src/next/trpc-helper";
import { MissingPathParameter } from "@chair-flight/base/errors";
import { Flashcard } from "@chair-flight/react/components";
import { AppHead, LayoutModuleBank } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type {
  QuestionBankFlashcardCollection,
  QuestionBankFlashcardContent,
  QuestionBankName,
} from "@chair-flight/base/types";
import type { GetStaticPaths, NextPage } from "next";
import type { FunctionComponent } from "react";

type PageProps = {
  flashcards: QuestionBankFlashcardCollection;
};

type PageParams = {
  questionBank: QuestionBankName;
  collectionId: string;
};

const FlashcardWithOwnControl: FunctionComponent<
  QuestionBankFlashcardContent
> = (props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <Flashcard
      {...props}
      sx={{ width: "100%", height: "100%" }}
      flipped={isFlipped}
      onFlip={() => setIsFlipped(!isFlipped)}
    />
  );
};

const FlashcardsThemePage: NextPage<PageProps> = ({ flashcards }) => {
  return (
    <LayoutModuleBank noPadding questionBank="prep">
      <AppHead
        title="Chair Flight - Flash Cards"
        linkTitle="Chair Flight - Flash Cards"
        linkDescription={[
          "Use these flash cards to practice for your interview. You can review",
          "all flash cards at once, or get 10 random cards to review. Try to",
          "answer the question out loud as you would in an interview. Consider",
          "recording your answer and playing it back to see how you sound.",
          "\n\n",
          "Once you are satisfied with the answer, Flip the card to see if you",
          "are close enough.",
        ].join(" ")}
      />
      <Grid container spacing={2} maxWidth="lg" margin="auto">
        {flashcards.flashcards.map((fc) => (
          <Grid key={fc.id} xs={12} sm={6} md={4} lg={3} sx={{ height: 400 }}>
            <FlashcardWithOwnControl {...fc} />
          </Grid>
        ))}
      </Grid>
    </LayoutModuleBank>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    const questionBank = params.questionBank;
    const collectionId = params.collectionId;
    if (!questionBank) throw new MissingPathParameter("questionBank");
    if (!collectionId) throw new MissingPathParameter("collectionId");

    const [{ flashcards }] = await Promise.all([
      helper.questionBank.getFlashcardsCollection.fetch(params),
      helper.questionBank.getConfig.fetch(params),
    ]);

    return { props: { flashcards } };
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
