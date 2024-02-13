import { Button, Card, Link, Typography } from "@mui/joy";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "@chair-flight/trpc/client";
import { FlashcardWithOwnControl } from "../../components/fashcard-with-own-control";
import { FlashcardTinder } from "../../components/flashcard-tinder";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

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

type Data = AppRouterOutput["containers"]["flashcards"]["getFlashcardTest"];

export const FlashcardTest = container<Props, Params, Data>(
  ({ questionBank, collectionId, seed, sx, component = "section" }) => {
    const params = { questionBank, collectionId, seed };
    const { flashcards, href, flashcardsHref } = FlashcardTest.useData(params);

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
                href={href}
                target="_blank"
                children={"Share Link"}
              />
              <Button
                component={Link}
                href={flashcardsHref}
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
  const router = helper.containers.flashcards;
  const questionBank = getRequiredParam(params, "questionBank");
  const collectionId = getRequiredParam(params, "collectionId");
  const seed = getRequiredParam(params, "seed");
  return await router.getFlashcardTest.fetch({
    questionBank,
    collectionId,
    seed,
  });
};

FlashcardTest.useData = (params) => {
  const router = trpc.containers.flashcards;
  const questionBank = getRequiredParam(params, "questionBank");
  const collectionId = getRequiredParam(params, "collectionId");
  const seed = getRequiredParam(params, "seed");
  return router.getFlashcardTest.useSuspenseQuery({
    questionBank,
    collectionId,
    seed,
  })[0];
};
