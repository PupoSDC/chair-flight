import { Grid } from "@mui/joy";
import { trpc } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import { FlashcardWithOwnControl } from "../../components/fashcard-with-own-control";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { AppRouterOutput } from "@cf/trpc/client";

type Props = {
  questionBank: QuestionBankName;
  collectionId: string;
};

type Params = {
  questionBank: QuestionBankName;
  collectionId: string;
};

type Data = AppRouterOutput["containers"]["flashcards"]["getFlashcardList"];

export const FlashcardList = container<Props, Params, Data>(
  ({ questionBank, collectionId, sx, component = "section" }) => {
    const params = { questionBank, collectionId };
    const { flashcards } = FlashcardList.useData(params);

    return (
      <Grid container spacing={2} sx={sx} component={component}>
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
  return await helper.containers.flashcards.getFlashcardList.fetch({
    questionBank,
    collectionId,
  });
};

FlashcardList.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const collectionId = getRequiredParam(params, "collectionId");
  return trpc.containers.flashcards.getFlashcardList.useSuspenseQuery({
    questionBank,
    collectionId,
  })[0];
};
