import { useState } from "react";
import { Button, Card, Link, Typography } from "@mui/joy";
import { getRandomId, getRandomShuffler } from "@chair-flight/core/app";
import {
  AppHead,
  AppHeaderMenu,
  FLASH_CARDS_DESC,
} from "@chair-flight/next/client";
import {
  Header,
  AppLayout,
  FlashCard,
  FlashCardTinder,
} from "@chair-flight/react/components";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { FlashCardContent } from "@chair-flight/base/types";
import type { NextPage } from "next";
import type { FunctionComponent } from "react";

type FlashCardsThemePagePropsParams = {
  collectionId: string;
  seed: string;
};

type FlashCardsThemePageProps = {
  seed: string;
  collectionId: string;
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
  collectionId,
  seed,
}) => {
  return (
    <>
      <AppHead
        title="Chair Flight - Flash Cards"
        linkTitle="Chair Flight - Flash Cards"
        linkDescription={FLASH_CARDS_DESC}
      />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main sx={{ p: { xs: 0, md: 0 } }}>
        <FlashCardTinder>
          {flashCards
            .map((fc) => <FlashCardWithOwnControl key={fc.id} {...fc} />)
            .concat([
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                key={"last card"}
              >
                <Typography sx={{ mb: "2", textAlign: "center" }} level={"h5"}>
                  You have reached the end of the test!
                </Typography>
                <Button
                  component={Link}
                  variant="plain"
                  sx={{ mb: 2 }}
                  href={`/flash-cards/${collectionId}/${seed}`}
                  target="_blank"
                  children={"Share Link"}
                />
                <Button
                  component={Link}
                  href={"/flash-cards"}
                  children="Finish"
                />
              </Card>,
            ])}
        </FlashCardTinder>
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps = ssrHandler<FlashCardsThemePageProps>(
  async ({ helper, context }) => {
    const { params } = context;
    const { collectionId, seed } = params as FlashCardsThemePagePropsParams;
    const shuffle = getRandomShuffler(seed);

    if (seed === "start") {
      const randomId = getRandomId();
      return {
        redirect: {
          permanent: false,
          destination: `/flash-cards/${collectionId}/${randomId}`,
        },
      };
    }

    const { flashCards } =
      await helper.flashCards.getFlashCardsCollection.fetch({
        collectionId,
      });

    return {
      props: {
        seed,
        collectionId,
        flashCards: shuffle(flashCards).slice(0, 10),
      },
    };
  },
);

export default FlashCardsThemePage;
