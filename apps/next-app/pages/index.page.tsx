import { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";
import { NoSsr } from "@mui/base";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import StyleIcon from "@mui/icons-material/Style";
import { Box, styled, Grid, Typography, Button, Link, Divider } from "@mui/joy";
import {
  CoolSlidingThing,
  CountUp,
  Header,
  HEADER_HEIGHT,
  ModuleSelectionButton,
  Typical,
  useThemeSwitcher,
} from "@chair-flight/react/components";
import { AppHead } from "@chair-flight/react/containers";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type {
  FlashcardContent,
  QuestionTemplate,
} from "@chair-flight/base/types";
import type { GetStaticProps, NextPage } from "next";

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const RightContainer = styled(Grid)<{ hasMounted: boolean }>`
  width: 100%;
  animation: ${fadeIn} ${(t) => (t.hasMounted ? 1 : 0)}s ease-in;
  display: flex;
  flex-direction: column;

  & > * {
    margin-bottom: ${(t) => t.theme.spacing(1)};
  }
`;

export type IndexPageProps = {
  numberOfAtplQuestions: number;
  numberOf737Questions: number;
  numberOfFlashcards: number;
  demoQuestion: QuestionTemplate;
  demoFlashcard: FlashcardContent;
};

export const IndexPage: NextPage<IndexPageProps> = ({
  numberOfAtplQuestions,
  numberOf737Questions,
}) => {
  const rightSideContainer = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useThemeSwitcher();
  const [hasMounted, setHasMounted] = useState(false);
  const height = `calc(100vh - ${HEADER_HEIGHT}px)`;

  useEffect(() => {
    setTimeout(() => setHasMounted(true), 1000);
  }, []);

  const goToTheme = (theme: "blue" | "teal" | "rose") => {
    setCurrentTheme(theme);
    const top = rightSideContainer.current?.offsetTop ?? 0;
    window.scrollTo({ top: top - HEADER_HEIGHT, behavior: "smooth" });
  };

  return (
    <>
      <AppHead
        linkDescription={[
          "Chair Flight is a community driven Aviation Question Bank built by ",
          "students for students. Now available for Alpha testing. ",
          `Explore ${numberOfAtplQuestions} questions, create tests, and `,
          "improve your knowledge... for free!",
        ].join("")}
      />
      <CoolSlidingThing />
      <Header />
      <Box component="main" sx={{ height: height, p: { xs: 1, md: 4 } }}>
        <Grid
          container
          spacing={{ xs: 1, md: 4 }}
          sx={{ height: "100%", maxWidth: 1200, mx: "auto" }}
        >
          <Grid
            xs={12}
            sm={6}
            sx={{
              my: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            }}
          >
            <Box sx={{ mb: { xs: 1, md: 2 } }}>
              <Typography
                level="h3"
                component="h1"
                sx={{ fontSize: { md: "3em" }, lineHeight: 1.2 }}
              >
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
            </Box>
            <ModuleSelectionButton
              fullWidth
              sx={{ mb: { xs: 1, md: 2 } }}
              color={"blue"}
              title={"ATPL theory"}
              description={[
                "Explore questions, learning objectives, and theory reviews ",
                "from the EASA QB ATPL exams, and create your own tests.",
              ].join("")}
              active={currentTheme === "blue"}
              icon={<AirplaneTicketIcon />}
              onClick={() => goToTheme("blue")}
              showMoreHref="/"
            />
            <ModuleSelectionButton
              fullWidth
              sx={{ mb: { xs: 1, md: 2 } }}
              color={"teal"}
              title={"Interview Prep"}
              description={[
                "Use our flash cards to practice answering open ended ",
                "questions and secure your first job.",
              ].join("")}
              active={currentTheme === "teal"}
              icon={<StyleIcon />}
              onClick={() => goToTheme("teal")}
              showMoreHref="/"
            />
            <ModuleSelectionButton
              fullWidth
              sx={{ mb: { xs: 1, md: 2 } }}
              color={"rose"}
              title={"737 Type rating"}
              active={currentTheme === "rose"}
              description={[
                `Prepare or review your theory knowledge for a type rating `,
                `on the Boeing 737 with ${numberOf737Questions} questions.`,
              ].join("")}
              icon={<FlightTakeoffIcon />}
              onClick={() => goToTheme("rose")}
              showMoreHref="/"
            />
            <Link
              sx={{ justifyContent: "center", width: "100%" }}
              href="/articles/about-us"
              children="About This Project"
              endDecorator={<ChevronRightIcon />}
            />
          </Grid>
          <Grid xs={12} sx={{ display: { sm: "none" } }}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          <Grid
            ref={rightSideContainer}
            xs={12}
            sm={6}
            sx={{
              my: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            }}
          >
            <NoSsr>
              {currentTheme === "blue" && (
                <RightContainer container hasMounted={hasMounted} xs={6}>
                  <Typography
                    level="h3"
                    component="h2"
                    sx={{ fontSize: { md: "3em" }, lineHeight: 1.2 }}
                  >
                    {`Explore `}
                    <CountUp
                      component={"span"}
                      end={numberOfAtplQuestions}
                      duration={2000}
                      sx={{
                        color: "primary.500",
                        width: "3.2em",
                        display: "inline-flex",
                        justifyContent: "flex-end",
                      }}
                    />
                    {` questions`}
                    <br />
                    {`In infinite combinations`}
                  </Typography>
                  <Typography level="h4" component="p" sx={{ mt: 2 }}>
                    Chair Flight&apos;s questions are organized into variants,
                    enabling you to practice challenging questions repeatedly
                    and promptly skip variants of questions you already
                    comprehend.
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ pt: 2 }}>
                    <Grid xs={12} sm={6}>
                      <Button
                        fullWidth
                        size="lg"
                        component={Link}
                        children={"Explore Learning Objectives"}
                        href="/modules/atpl-theory/learning-objectives"
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Button
                        fullWidth
                        size="lg"
                        component={Link}
                        children={"Explore Questions"}
                        href="/modules/atpl-theory/questions"
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Button
                        fullWidth
                        size="lg"
                        component={Link}
                        children={"Create a Test"}
                        href="/modules/atpl-theory/tests/new"
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Button
                        fullWidth
                        disabled
                        size="lg"
                        component={Link}
                        children={"Coming soon"}
                        href="/questions"
                      />
                    </Grid>
                  </Grid>
                </RightContainer>
              )}
              {currentTheme === "teal" && (
                <RightContainer container hasMounted={hasMounted} xs={6}>
                  <Button>Start test</Button>
                  <Button>Potato</Button>
                </RightContainer>
              )}
              {currentTheme === "rose" && (
                <RightContainer container hasMounted={hasMounted} xs={6}>
                  <Typography
                    level="h3"
                    component="h2"
                    sx={{ fontSize: { md: "3em" }, lineHeight: 1.2 }}
                  >
                    {`Explore `}
                    <CountUp
                      component={"span"}
                      end={numberOf737Questions}
                      duration={2000}
                      sx={{
                        color: "primary.500",
                        width: "2.0em",
                        display: "inline-flex",
                        justifyContent: "flex-end",
                      }}
                    />
                    {` questions`}
                    <br />
                    {`In infinite combinations`}
                  </Typography>
                  <Typography level="h4" component="p" sx={{ mt: 2 }}>
                    Chair Flight&apos;s questions are organized into variants,
                    enabling you to practice challenging questions repeatedly
                    and promptly skip variants of questions you already
                    comprehend.
                  </Typography>
                  <Grid container spacing={2} sx={{ pt: 2 }}>
                    <Grid xs={6}>
                      <Button
                        fullWidth
                        size="lg"
                        component={Link}
                        children={"Explore Questions"}
                        href="/modules/737-type-rating/questions"
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Button
                        fullWidth
                        size="lg"
                        component={Link}
                        children={"Create a Test"}
                        href="/modules/737-type-rating/tests/new"
                      />
                    </Grid>
                  </Grid>
                </RightContainer>
              )}
            </NoSsr>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  const helper = await getTrpcHelper();
  const flashcardId = "3b1ba81a-df7a-4e9a-a04d-c15a09820eb0";
  const questionId = "QYFPA3CY4E";
  const [
    { numberOfQuestions: numberOfAtplQuestions },
    { questionTemplate: demoQuestion },
    { numberOfFlashcards },
    { flashcard: demoFlashcard },
    { numberOfQuestions: numberOf737Questions },
  ] = await Promise.all([
    helper.questionBankAtpl.getNumberOfQuestions.fetch(),
    helper.questionBankAtpl.getQuestion.fetch({ questionId }),
    helper.interviewPrep.getNumberOfFlashcards.fetch(),
    helper.interviewPrep.getFlashcard.fetch({ flashcardId }),
    helper.questionBank737.getNumberOfQuestions.fetch(),
  ]);

  return {
    props: {
      numberOfAtplQuestions,
      numberOf737Questions,
      numberOfFlashcards,
      demoQuestion,
      demoFlashcard,
    },
  };
};

export default IndexPage;
