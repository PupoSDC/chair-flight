import { useState } from "react";
import { Box, Button, Card, GlobalStyles, Link, Typography } from "@mui/joy";
import { getRandomId, getRandomShuffler } from "@chair-flight/core/app";
import {
  Flashcard,
  FlashcardTinder,
  getGlobalColorScheme,
} from "@chair-flight/react/components";
import { AppHead } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { FlashcardContent } from "@chair-flight/base/types";
import type { NextPage } from "next";
import type { FunctionComponent } from "react";

type FlashcardsThemePagePropsParams = {
  collectionId: string;
  seed: string;
};

type FlashcardsThemePageProps = {
  seed: string;
  collectionId: string;
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

const FlashcardsThemePage: NextPage<FlashcardsThemePageProps> = ({
  flashcards,
  collectionId,
  seed,
}) => {
  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <AppHead
        title="Chair Flight - Flash Cards"
        linkTitle="Chair Flight - Flash Cards"
        linkDescription={[
          "Use these flash cards to practice for your interview. You can review",
          "all flash cards at once, or get 10 random cards to review. Try to",
          "answer the question outloud as you would in an interview. Consider",
          "recording your answer and playing it back to see how you sound.",
          "\n\n",
          "Once you are satisfied with the answer, Flip the card to see if you",
          "are close enough.",
        ].join(" ")}
      />
      <GlobalStyles
        styles={(t) => {
          return getGlobalColorScheme(t.colorSchemes.light.palette.primaryTeal);
        }}
      />
      <FlashcardTinder>
        {flashcards
          .map((fc) => <FlashcardWithOwnControl key={fc.id} {...fc} />)
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
                href={`/modules/prep/flashcards/${collectionId}/${seed}`}
                target="_blank"
                children={"Share Link"}
              />
              <Button
                component={Link}
                href={"/modules/prep/flashcards"}
                children="Finish"
              />
            </Card>,
          ])}
      </FlashcardTinder>
    </Box>
  );
};

export const getServerSideProps = ssrHandler<FlashcardsThemePageProps>(
  async ({ helper, context }) => {
    const { params } = context;
    const { collectionId, seed } = params as FlashcardsThemePagePropsParams;
    const shuffle = getRandomShuffler(seed);

    if (seed === "start") {
      const randomId = getRandomId();
      return {
        redirect: {
          permanent: false,
          destination: `/modules/prep/flashcards/${collectionId}/${randomId}`,
        },
      };
    }

    const { flashcards } =
      await helper.interviewPrep.getFlashcardsCollection.fetch({
        collectionId,
      });

    return {
      props: {
        seed,
        collectionId,
        flashcards: shuffle(flashcards).slice(0, 10),
      },
    };
  },
);

export default FlashcardsThemePage;
