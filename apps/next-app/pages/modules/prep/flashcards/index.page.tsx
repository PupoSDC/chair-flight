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
import { AppHead, LayoutPublic } from "@chair-flight/react/containers";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

type flashcardsIndexPageProps = {
  flashcardCollections: Array<{
    collectionId: string;
    name: string;
    numberOfCards: number;
  }>;
};

const QuestionsIndexPage: NextPage<flashcardsIndexPageProps> = ({
  flashcardCollections,
}) => {
  return (
    <LayoutPublic noPadding>
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
      <Grid container spacing={2} maxWidth="lg" margin="auto">
        <Grid xs={12}>
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
          <Typography sx={{ mt: 3 }} level="h3" color="primary">
            Have fun!
          </Typography>
        </Grid>

        {flashcardCollections.map((fc) => (
          <Grid
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={fc.collectionId}
            sx={{ pb: { xs: 1, sm: 0 }, pt: 2 }}
          >
            <Card sx={{ height: 250 }}>
              <CardCover>
                <Image
                  src="/images/flashcards/737.png"
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
                    {fc.name}
                  </Typography>
                  <Typography
                    level="h4"
                    fontSize="md"
                    mb={4}
                    textColor={"#fff"}
                  >
                    {fc.numberOfCards} cards
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    children="View All"
                    variant="outlined"
                    component={Link}
                    href={`/modules/prep/flashcards/${fc.collectionId}`}
                  />
                  <Button
                    sx={{ mr: 1 }}
                    children="Start!"
                    component={Link}
                    href={`/modules/prep/flashcards/${fc.collectionId}/start`}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </LayoutPublic>
  );
};

export const getStaticProps: GetStaticProps<
  flashcardsIndexPageProps
> = async () => {
  await preloadContentForStaticRender(await import("fs/promises"));
  const helper = await getTrpcHelper();
  const { flashcardCollections } =
    await helper.interviewPrep.getFlashcardsCollections.fetch();

  return {
    props: {
      flashcardCollections: flashcardCollections,
    },
  };
};

export default QuestionsIndexPage;
