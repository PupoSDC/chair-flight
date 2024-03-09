import { Grid } from "@mui/joy";
import { ModulesMain } from "@cf/next/ui";
import { QuestionBank } from "@cf/providers/question-bank";
import { FlashcardWithOwnControl } from "@cf/react/ui";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type PageProps = {
  params: {
    questionBank: QuestionBankName;
    collectionId: string;
  };
};

const Page: FunctionComponent<PageProps> = async ({ params }) => {
  const bank = new QuestionBank(params.questionBank);
  const collection = await bank.getOne("flashcards", params.collectionId);

  return (
    <ModulesMain>
      <Grid
        container
        spacing={2}
        sx={{ maxWidth: "xl", width: "100%", margin: "auto" }}
      >
        {collection.flashcards.map((fc) => (
          <Grid key={fc.id} xs={12} sm={6} md={4} lg={3} sx={{ height: 400 }}>
            <FlashcardWithOwnControl
              {...fc}
              sx={{ width: "100%", height: "100%" }}
            />
          </Grid>
        ))}
      </Grid>
    </ModulesMain>
  );
};

export default Page;
