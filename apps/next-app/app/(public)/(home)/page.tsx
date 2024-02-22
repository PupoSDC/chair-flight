import { Divider, Stack, Typography } from "@mui/joy";
import { QuestionBank } from "@cf/providers/question-bank";
import { BackgroundSlidingImages, Typical } from "@cf/react/components";
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
  numberOfFlashcards: (await QuestionBank.get("prep").getAll("flashcards"))
    .length,
  numberOfAtplQuestions: (await QuestionBank.get("atpl").getAll("questions"))
    .length,
  numberOfTypeQuestions: (await QuestionBank.get("type").getAll("questions"))
    .length,
});

const WelcomePage: FunctionComponent = async () => {
  const { numberOfFlashcards, numberOfAtplQuestions, numberOfTypeQuestions } =
    await getData();

  return (
    <>
      <ThemeOverride />
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
