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
import dedent from "ts-dedent";
import {
  AppHead,
  AppHeaderMenu,
  FLASH_CARDS_DESC,
} from "@chair-flight/next/client";
import { staticHandler } from "@chair-flight/next/server";
import { Header, AppLayout } from "@chair-flight/react/components";
import type { NextPage } from "next";

type FlashCardsIndexPageProps = {
  flashCardCollections: Array<{
    id: string;
    name: string;
    numberOfCards: number;
  }>;
};

const QuestionsIndexPage: NextPage<FlashCardsIndexPageProps> = ({
  flashCardCollections,
}) => {
  return (
    <>
      <AppHead
        title="Chair Flight - Flash Cards"
        linkTitle="Chair Flight - Flash Cards"
        linkDescription={FLASH_CARDS_DESC}
      />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main>
        <AppLayout.MainGrid sx={{ height: "auto", pb: 2 }}>
          <Grid xs={12}>
            <AppLayout.Header>
              <Typography level="h1">Flash Cards</Typography>
            </AppLayout.Header>
            <Typography>
              {dedent`
                Practice for open-ended interview questions.
              `}
              <br />
              {FLASH_CARDS_DESC}
            </Typography>
            <Typography sx={{ mt: 3 }} level="h3" color="primary">
              Have fun!
            </Typography>
          </Grid>

          {flashCardCollections.map((fc) => (
            <Grid
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={fc.id}
              sx={{ pb: { xs: 1, sm: 0 }, pt: 2 }}
            >
              <Card sx={{ height: 250 }}>
                <CardCover>
                  <Image
                    src="/images/flash-cards/737.png"
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
                    <Typography level="h2" fontSize="lg">
                      {fc.name}
                    </Typography>
                    <Typography level="h4" fontSize="md" mb={4}>
                      {fc.numberOfCards} cards
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      children="View All"
                      variant="outlined"
                      component={Link}
                      href={`/flash-cards/${fc.id}`}
                    />
                    <Button
                      sx={{ mr: 1 }}
                      children="Start!"
                      component={Link}
                      href={`/flash-cards/${fc.id}/start`}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </AppLayout.MainGrid>
      </AppLayout.Main>
    </>
  );
};

export const getStaticProps = staticHandler<FlashCardsIndexPageProps>(
  async ({ questionBank }) => {
    const flashCards = await questionBank.getAllFlashCards();

    return {
      props: {
        flashCardCollections: Object.entries(flashCards).map(
          ([name, items]) => ({
            id: name,
            name: name
              .split("-")
              .map((s) => s[0].toUpperCase() + s.slice(1))
              .join(" "),
            numberOfCards: items.length,
          })
        ),
      },
    };
  }
);

export default QuestionsIndexPage;
