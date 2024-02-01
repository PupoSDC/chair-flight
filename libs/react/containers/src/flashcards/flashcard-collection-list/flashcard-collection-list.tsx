import { default as Image } from "next/image";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardCover,
  Grid,
  Link,
  Typography,
} from "@mui/joy";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data =
  AppRouterOutput["containers"]["flashcards"]["getFlashcardCollectionList"];

export const FlashcardCollectionList = container<Props, Params, Data>(
  ({ questionBank, sx, component = "section" }) => {
    const params = { questionBank };
    const { collections } = FlashcardCollectionList.useData(params);

    return (
      <Grid container spacing={2} component={component} sx={sx}>
        {collections.map((fc) => (
          <Grid xs={12} sm={6} md={4} lg={3} key={fc.id}>
            <Card sx={{ height: { xs: 160, sm: 250 } }}>
              <CardCover>
                <Image
                  src={`/images/flashcards/${fc.id}.png`}
                  loading="lazy"
                  alt="Aircraft landing"
                  fill
                />
              </CardCover>
              <CardCover
                sx={{
                  background: `
              linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), 
              linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)
            `,
                }}
              />
              <CardContent sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Typography level="h2" fontSize="lg" textColor={"#fff"}>
                    {fc.title}
                  </Typography>
                  <Typography
                    level="h4"
                    fontSize="md"
                    mb={4}
                    textColor={"#fff"}
                  >
                    {fc.numberOfFlashcards} cards
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    children="View All"
                    variant="outlined"
                    component={Link}
                    href={`/modules/prep/flashcards/${fc.id}`}
                  />
                  <Button
                    sx={{ mr: 1 }}
                    children="Start!"
                    component={Link}
                    href={`/modules/prep/flashcards/${fc.id}/start`}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  },
);

FlashcardCollectionList.displayName = "FlashcardCollectionList";

FlashcardCollectionList.getData = async ({ helper, params }) => {
  const router = helper.containers.flashcards;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getFlashcardCollectionList.fetch({ questionBank });
};

FlashcardCollectionList.useData = (params) => {
  const router = trpc.containers.flashcards;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getFlashcardCollectionList.useSuspenseQuery({
    questionBank,
  })[0];
};
