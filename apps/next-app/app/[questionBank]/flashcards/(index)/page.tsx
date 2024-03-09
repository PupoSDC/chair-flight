import { default as Image } from "next/image";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardCover,
  CardContent,
  Button,
  Link,
} from "@mui/joy";
import { ModulesMain } from "@cf/next/ui";
import { QuestionBank } from "@cf/providers/question-bank";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type Props = {
  params: {
    questionBank: QuestionBankName;
  };
};

const Page: FunctionComponent<Props> = async ({ params }) => {
  const bank = new QuestionBank(params.questionBank);
  const rawCollections = await bank.getAll("flashcards");
  const collections = rawCollections.map((collection) => ({
    id: collection.id,
    title: collection.title,
    numberOfFlashcards: collection.flashcards.length,
  }));

  return (
    <ModulesMain>
      <Box component="section" maxWidth="lg" margin="auto">
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
        <Grid container spacing={2} sx={{ mt: 2 }}>
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      children="View All"
                      variant="outlined"
                      component={Link}
                      href={`/modules/prep/flashcards/${fc.id}`}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ModulesMain>
  );
};

export default Page;

export const metadata = {
  title: "Chair Flight - Flash Cards",
  description: [
    "Use these flash cards to practice for your interview. You can review",
    "all flash cards at once, or get 10 random cards to review. Try to",
    "answer the question outloud as you would in an interview. Consider",
    "recording your answer and playing it back to see how you sound.",
    "\n\n",
    "Once you are satisfied with the answer, Flip the card to see if you",
    "are close enough.",
  ].join(" "),
};
