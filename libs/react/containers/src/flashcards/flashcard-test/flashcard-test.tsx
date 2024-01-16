import { Button, Card, Link, Typography } from "@mui/joy";
import { getRandomShuffler } from "@chair-flight/core/app";
import { FlashcardTinder } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { FlashcardWithOwnControl } from "../components/fashcard-with-own-control";
import type {
  QuestionBankFlashcardContent,
  QuestionBankName,
} from "@chair-flight/base/types";

type Props = {
  questionBank: QuestionBankName;
  collectionId: string;
  seed: string;
};

type Params = {
  questionBank: QuestionBankName;
  collectionId: string;
  seed: string;
};

type Data = {
  flashcards: QuestionBankFlashcardContent[];
};

export const FlashcardTest = container<Props, Params, Data>(
  ({ questionBank, collectionId, seed, sx, component = "section" }) => {
    const params = { questionBank, collectionId, seed };
    const { flashcards } = FlashcardTest.useData(params);

    return (
      <FlashcardTinder component={component} sx={sx}>
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
                href={`/modules/${questionBank}/flashcards/${collectionId}/${seed}`}
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
    );
  },
);

FlashcardTest.displayName = "FlashcardTest";

FlashcardTest.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const collectionId = getRequiredParam(params, "collectionId");
  const seed = getRequiredParam(params, "seed");
  const shuffle = getRandomShuffler(seed);

  const data = await helper.questionBank.getFlashcardsCollection.fetch({
    questionBank,
    collectionId,
  });

  const rawFlashcards = data.flashcardCollection.flashcards;
  const flashcards = shuffle(rawFlashcards).slice(0, 10);
  return { flashcards };
};

FlashcardTest.useData = (params) => {
  const qb = trpc.questionBank;
  const questionBank = getRequiredParam(params, "questionBank");
  const collectionId = getRequiredParam(params, "collectionId");
  const seed = getRequiredParam(params, "seed");
  const shuffle = getRandomShuffler(seed);

  const data = qb.getFlashcardsCollection.useSuspenseQuery({
    questionBank,
    collectionId,
  })[0];

  const rawFlashcards = data.flashcardCollection.flashcards;
  const flashcards = shuffle(rawFlashcards).slice(0, 10);
  return { flashcards };
};
