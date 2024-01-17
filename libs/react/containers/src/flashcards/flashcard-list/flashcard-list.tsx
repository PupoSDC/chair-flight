import { Grid } from "@mui/joy";
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
};

type Params = {
  questionBank: QuestionBankName;
  collectionId: string;
};

type Data = {
  flashcards: QuestionBankFlashcardContent[];
};

export const FlashcardList = container<Props, Params, Data>(
  ({ questionBank, collectionId, sx, component = "section" }) => {
    const params = { questionBank, collectionId };
    const { flashcards } = FlashcardList.useData(params);

    return (
      <Grid
        container
        spacing={2}
        maxWidth="lg"
        margin="auto"
        sx={sx}
        component={component}
      >
        {flashcards.map((fc) => (
          <Grid key={fc.id} xs={12} sm={6} md={4} lg={3} sx={{ height: 400 }}>
            <FlashcardWithOwnControl {...fc} />
          </Grid>
        ))}
      </Grid>
    );
  },
);

FlashcardList.displayName = "FlashcardList";

FlashcardList.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const collectionId = getRequiredParam(params, "collectionId");

  const data = await helper.questionBank.getFlashcardsCollection.fetch({
    questionBank,
    collectionId,
  });

  const flashcards = data.flashcardCollection.flashcards;
  return { flashcards };
};

FlashcardList.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const collectionId = getRequiredParam(params, "collectionId");

  const data = trpc.questionBank.getFlashcardsCollection.useSuspenseQuery({
    questionBank,
    collectionId,
  })[0];

  const flashcards = data.flashcardCollection.flashcards;
  return { flashcards };
};
