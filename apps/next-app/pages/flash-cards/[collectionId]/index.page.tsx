import { useState } from "react";
import { Grid } from "@mui/joy";
import {
  AppHead,
  AppHeaderMenu,
  FLASH_CARDS_DESC,
} from "@chair-flight/next/client";
import { Header, AppLayout, FlashCard } from "@chair-flight/react/components";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { FlashCardContent } from "@chair-flight/base/types";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { FunctionComponent } from "react";

type FlashCardsThemePageProps = {
  flashCards: Array<FlashCardContent>;
};

const FlashCardWithOwnControl: FunctionComponent<FlashCardContent> = (
  props,
) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <FlashCard
      {...props}
      sx={{ width: "100%", height: "100%" }}
      flipped={isFlipped}
      onFlip={() => setIsFlipped(!isFlipped)}
    />
  );
};

const FlashCardsThemePage: NextPage<FlashCardsThemePageProps> = ({
  flashCards,
}) => (
  <>
    <AppHead
      title="Chair Flight - Flash Cards"
      linkTitle="Chair Flight - Flash Cards"
      linkDescription={FLASH_CARDS_DESC}
    />
    <Header>
      <AppHeaderMenu />
    </Header>
    <AppLayout.Main>
      <AppLayout.MainGrid>
        {flashCards.map((fc) => (
          <Grid key={fc.id} xs={12} sm={6} md={4} lg={3} sx={{ height: 400 }}>
            <FlashCardWithOwnControl {...fc} />
          </Grid>
        ))}
      </AppLayout.MainGrid>
    </AppLayout.Main>
  </>
);

export const getStaticProps: GetStaticProps<FlashCardsThemePageProps> = async ({
  params,
}) => {
  const helper = await getTrpcHelper();
  const { collectionId } = params as { collectionId: string };
  const { flashCards } = await helper.flashCards.getFlashCardsCollection.fetch({
    collectionId,
  });

  return {
    props: {
      flashCards,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const helper = await getTrpcHelper();
  const { flashCardCollections } =
    await helper.flashCards.getFlashCardCollections.fetch();

  return {
    fallback: false,
    paths: flashCardCollections.map(({ collectionId }) => ({
      params: { collectionId },
    })),
  };
};

export default FlashCardsThemePage;
