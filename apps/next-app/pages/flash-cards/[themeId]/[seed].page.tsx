import { useState } from "react";
import { Grid } from "@mui/joy";
import { NotFoundError } from "@chair-flight/base/errors";
import { getRandomId, getRandomShuffler } from "@chair-flight/core/app";
import { AppHead, AppHeaderMenu } from "@chair-flight/next/client";
import { ssrHandler } from "@chair-flight/next/server";
import { Header, AppLayout, FlashCard } from "@chair-flight/react/components";
import type { FlashCardContent } from "@chair-flight/base/types";
import type { NextPage } from "next";
import type { FunctionComponent } from "react";

type FlashCardsThemePageProps = {
  flashCards: Array<FlashCardContent>;
};

const FlashCardWithOwnControl: FunctionComponent<FlashCardContent> = (
  props
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
    <AppHead />
    <Header>
      <AppHeaderMenu />
    </Header>
    <AppLayout.Main>
      <AppLayout.MainGrid>
        {flashCards.map((fc) => (
          <Grid key={fc.id} xs={12} sm={6} md={4} lg={3} sx={{ height: 400 }}>
            <FlashCardWithOwnControl key={fc.id} {...fc} />
          </Grid>
        ))}
      </AppLayout.MainGrid>
    </AppLayout.Main>
  </>
);

export const getServerSideProps = ssrHandler<FlashCardsThemePageProps>(
  async ({ questionBank, context }) => {
    const { params } = context;
    const { themeId, seed } = params as { themeId: string; seed: string };
    if (seed === "start") {
      const randomId = getRandomId();
      return {
        redirect: {
          permanent: false,
          destination: `/flash-cards/${themeId}/${randomId}`,
        },
      };
    }

    const collection = (await questionBank.getAllFlashCards())[themeId];
    if (!collection) throw new NotFoundError("Flash card collection not found");

    const shuffle = getRandomShuffler(seed);
    const flashCards = shuffle(collection).slice(0, 10);

    return {
      props: {
        flashCards,
      },
    };
  }
);

export default FlashCardsThemePage;
