import { default as Image } from "next/image";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  Typography,
  CardCover,
  Box,
} from "@mui/joy";
import { MissingPathParameter } from "@chair-flight/base/errors";
import { AppHead, LayoutModuleBank } from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type FlashcardsIndexPageParams = {
  questionBank: QuestionBankName;
};

type FlashcardsIndexPageProps = {
  questionBank: QuestionBankName;
};

const FlashcardsIndexPage: NextPage<FlashcardsIndexPageProps> = ({
  questionBank,
}) => {
  const [{ flashcardCollections }] =
    trpc.questionBank.getFlashcardsCollections.useSuspenseQuery({
      questionBank,
    });

  return (
    <LayoutModuleBank noPadding questionBank="prep">
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
      <Box component="section" maxWidth="lg" margin="auto" p={2}>
        <Typography level="h1">Flash Cards</Typography>
        <Typography>
          Practice for open-ended interview questions.
          <br />
          Use these flash cards to practice for your interview. You can review
          all flash cards at once, or get 10 random cards to review. Try to
          answer the question outloud as you would in an interview. Consider
          recording your answer and playing it back to see how you sound.
          <br />
          Once you are satisfied with the answer, Flip the card to see if you
          are close enough.
        </Typography>
        <Typography level="h3" sx={{ mt: 3, color: "primary.500" }}>
          Have fun!
        </Typography>
      </Box>

      <Grid container spacing={2} maxWidth="lg" margin="auto">
        {flashcardCollections.map((fc) => (
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
    </LayoutModuleBank>
  );
};

export const getStaticProps: GetStaticProps<
  FlashcardsIndexPageProps,
  FlashcardsIndexPageParams
> = async ({ params }) => {
  const helper = await getTrpcHelper();
  const questionBank = params?.questionBank;
  if (!questionBank) throw new MissingPathParameter("questionBank");
  await preloadContentForStaticRender(await import("fs/promises"));

  await Promise.all([
    helper.questionBank.getFlashcardsCollections.fetch({ questionBank }),
    helper.questionBank.getConfig.fetch({ questionBank }),
  ]);

  return {
    props: { questionBank },
  };
};

export const getStaticPaths: GetStaticPaths<
  FlashcardsIndexPageParams
> = async () => {
  const banks: QuestionBankName[] = ["prep"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default FlashcardsIndexPage;
