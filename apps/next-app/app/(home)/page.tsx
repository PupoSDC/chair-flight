import { Box, Divider, Link, Stack, Typography } from "@mui/joy";
import {
  AppButtonsContainer,
  BugReportButton,
  GithubButton,
  ThemeButton,
} from "@cf/next/user";
import {
  AppHeader,
  AppLogo,
  BackgroundSlidingImages,
  Typical,
} from "@cf/react/components";
import { providers } from "@cf/trpc/server";
import {
  LeftContainer,
  MainContainer,
  RightContainer,
} from "./_client/containers";
import { ModuleSelectionButtons } from "./_client/module-selection-buttons";
import { PreviewAtpl } from "./_client/preview-atpl";
import { PreviewPrep } from "./_client/preview-prep";
import { PreviewType } from "./_client/preview-type";
import { ThemeOverride } from "./_client/theme-override";
import type { FunctionComponent } from "react";

const getData = async () => ({
  numberOfFlashcards: (
    await providers.questionBanks["type"].getAll("flashcards")
  ).length,
  numberOfAtplQuestions: (
    await providers.questionBanks["atpl"].getAll("questions")
  ).length,
  numberOfTypeQuestions: (
    await providers.questionBanks["type"].getAll("questions")
  ).length,
});

const WelcomePage: FunctionComponent = async () => {
  const { numberOfFlashcards, numberOfAtplQuestions, numberOfTypeQuestions } =
    await getData();

  return (
    <>
      <ThemeOverride />
      <AppHeader>
        <AppLogo component={Link} href="/" />
        <Box component="nav">
          <Link href="/articles/blog" color="neutral" fontSize="sm">
            Blog
          </Link>
        </Box>
        <AppButtonsContainer>
          <BugReportButton />
          <GithubButton />
          <ThemeButton />
        </AppButtonsContainer>
      </AppHeader>
      <BackgroundSlidingImages />
      <MainContainer>
        <LeftContainer component="section">
          <Stack
            sx={{
              width: "100%",
              textAlign: { xs: "center", md: "left" },
              "& > *": { width: "100%" },
            }}
          >
            <Typography level="h3" component="h1">
              Chair Flight is <br />
              <Typical
                sx={{ color: "primary.500" }}
                steps={[
                  "Community Built",
                  2000,
                  "Minimalistic",
                  2000,
                  "Free",
                  2000,
                ]}
              />
              &nbsp;
            </Typography>
            <Typography level="h4" component="h2">
              Built by students for students.
            </Typography>
          </Stack>
          <ModuleSelectionButtons />
        </LeftContainer>
        <Divider sx={{ my: 2, display: { sm: "none" } }} />
        <RightContainer component="section">
          <PreviewAtpl numberOfQuestions={numberOfAtplQuestions} />
          <PreviewType numberOfQuestions={numberOfTypeQuestions} />
          <PreviewPrep numberOfQuestions={numberOfFlashcards} />
        </RightContainer>
      </MainContainer>
    </>
  );
};

export default WelcomePage;
