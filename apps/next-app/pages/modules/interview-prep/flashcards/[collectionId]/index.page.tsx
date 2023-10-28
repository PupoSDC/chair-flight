import { useState } from "react";
import { Grid } from "@mui/joy";
import { Header, AppLayout, Flashcard } from "@chair-flight/react/components";
import { AppHead, AppHeaderMenu } from "@chair-flight/react/containers";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { FlashcardContent } from "@chair-flight/base/types";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { FunctionComponent } from "react";

type flashcardsThemePageProps = {
  flashcards: Array<FlashcardContent>;
};

const FlashcardWithOwnControl: FunctionComponent<FlashcardContent> = (
  props,
) => {
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

const flashcardsThemePage: NextPage<flashcardsThemePageProps> = ({
  flashcards,
}) => (
  <>
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
    <Header>
      <AppHeaderMenu />
    </Header>
    <AppLayout.Main>
      <AppLayout.MainGrid>
        {flashcards.map((fc) => (
          <Grid key={fc.id} xs={12} sm={6} md={4} lg={3} sx={{ height: 400 }}>
            <FlashcardWithOwnControl {...fc} />
          </Grid>
        ))}
      </AppLayout.MainGrid>
    </AppLayout.Main>
  </>
);

export const getStaticProps: GetStaticProps<flashcardsThemePageProps> = async ({
  params,
}) => {
  const helper = await getTrpcHelper();
  const { collectionId } = params as { collectionId: string };
  const { flashcards } =
    await helper.interviewPrep.getFlashcardsCollection.fetch({
      collectionId,
    });

  return {
    props: {
      flashcards,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const helper = await getTrpcHelper();
  const { flashcardCollections } =
    await helper.interviewPrep.getFlashcardsCollections.fetch();

  return {
    fallback: false,
    paths: flashcardCollections.map(({ collectionId }) => ({
      params: { collectionId },
    })),
  };
};

export default flashcardsThemePage;
