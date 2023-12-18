import { useRef, useState } from "react";
import { keyframes } from "@emotion/react";
import { NoSsr } from "@mui/base";
import { default as AirplaneTicketIcon } from "@mui/icons-material/AirplaneTicket";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as FlightTakeoffIcon } from "@mui/icons-material/FlightTakeoff";
import { default as StyleIcon } from "@mui/icons-material/Style";
import { Box, styled, Grid, Typography, Button, Link, Divider } from "@mui/joy";
import {
  CoolSlidingThing,
  CountUp,
  ModuleSelectionButton,
  Typical,
} from "@chair-flight/react/components";
import {
  AppHead,
  GlobalColorScheme,
  LayoutPublic,
} from "@chair-flight/react/containers";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { GlobalColorSchemeProps } from "@chair-flight/react/containers";
import type { GetStaticProps, NextPage } from "next";

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const RightContainer = styled(Grid)`
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-in;

  & > * {
    margin-bottom: ${(t) => t.theme.spacing(1)};
  }
`;

type IndexPageProps = {
  numberOfAtplQuestions: number;
  numberOf737Questions: number;
  numberOfA320Questions: number;
  numberOfFlashcards: number;
};

type Theme = "737" | "atpl" | "prep";

const MEDIA_LONG_SCREEN = "@media (min-height: 560px) and (min-width: 440px)";

export const IndexPage: NextPage<IndexPageProps> = ({
  numberOfFlashcards,
  numberOfAtplQuestions,
  numberOf737Questions,
  numberOfA320Questions,
}) => {
  const rightSideContainer = useRef<HTMLDivElement>(null);
  const [module, setModule] = useState<GlobalColorSchemeProps["module"]>();

  const goToTheme = (theme: Theme) => {
    setModule(theme);
    const top = rightSideContainer.current?.offsetTop ?? 0;
    setTimeout(
      () => window.scrollTo({ top: top - 50, behavior: "smooth" }),
      200,
    );
  };

  const headerHeight = LayoutPublic.css.headerHeight;

  return (
    <LayoutPublic fixedHeight noPadding background={<CoolSlidingThing />}>
      <GlobalColorScheme module={module} />
      <AppHead
        linkDescription={[
          "Chair Flight is a community driven Aviation Question Bank built by ",
          "students for students. Now available for Alpha testing. ",
          `Explore ${numberOfAtplQuestions} questions, create tests, and `,
          "improve your knowledge... for free!",
        ].join("")}
      />
      <Box
        sx={{
          display: "flex",
          p: { xs: 2, md: 4 },
          flexDirection: { xs: "column", md: "row" },
          minHeight: "100%",
          maxWidth: 1240,
          mx: "auto",
        }}
      >
        <Box
          sx={(t) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mx: "auto",
            top: "50%",
            justifyContent: {
              xs: "space-around",
              md: "center",
            },
            maxWidth: {
              xs: 620,
              md: `calc(${460}px - ${t.spacing(2)})`,
              lg: `calc(${620}px - ${t.spacing(2)})`,
            },
            minHeight: {
              xs: `calc(100vh - ${headerHeight} - ${t.spacing(2)})`,
              md: `100%`,
            },
            position: {
              xs: "relative",
              md: "fixed",
            },
            transform: {
              xs: "none",
              md: `translate(0, calc(-50% + ${headerHeight} / 2))`,
            },
            "& > *": {
              mb: 1,
              [MEDIA_LONG_SCREEN]: { mb: 2 },
            },
          })}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              textAlign: { xs: "center", md: "left" },
              "& > *": { width: "100%" },
            }}
          >
            <Typography
              level="h3"
              component="h1"
              sx={{
                [MEDIA_LONG_SCREEN]: { fontSize: "3em" },
                lineHeight: 1.2,
              }}
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
          <Box>
            <ModuleSelectionButton
              fullWidth
              sx={{ mb: { xs: 1, md: 2 } }}
              color={"blue"}
              title={"ATPL theory"}
              description={[
                "Explore questions, learning objectives, and theory reviews ",
                "from the EASA QB ATPL exams.",
              ].join("")}
              active={module === "atpl"}
              icon={<AirplaneTicketIcon />}
              onClick={() => goToTheme("atpl")}
              showMoreHref="/modules/atpl"
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
              active={module === "prep"}
              icon={<StyleIcon />}
              onClick={() => goToTheme("prep")}
              showMoreHref="/modules/prep"
            />
            <ModuleSelectionButton
              fullWidth
              sx={{ mb: { xs: 1, md: 2 } }}
              color={"rose"}
              title={"Type Rating"}
              active={["737", "a320"].includes(module ?? "")}
              description={[
                `Prepare or review your theory knowledge for a type rating `,
                `on the Boeing 737 with ${numberOf737Questions} questions, `,
                `or the Airbus A320 with ${numberOfA320Questions} questions.`,
              ].join("")}
              icon={<FlightTakeoffIcon />}
              onClick={() => goToTheme("737")}
              showMoreHref="/modules/737"
            />
          </Box>
          <Link
            sx={{ justifyContent: "center", width: "100%" }}
            href="/articles/about-us"
            children="About This Project"
            endDecorator={<ChevronRightIcon />}
          />
        </Box>
        <Divider sx={{ my: 2, display: { sm: "none" } }} />
        <Box
          ref={rightSideContainer}
          sx={(t) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mx: "auto",
            width: "100%",
            margin: {
              xs: "auto",
              md: "0 0 0 auto",
            },
            justifyContent: {
              xs: "space-around",
              md: "center",
            },
            maxWidth: {
              xs: 620,
              md: `calc(100% - ${460}px - ${t.spacing(2)})`,
              lg: `calc(100% - ${620}px - ${t.spacing(2)})`,
            },
            minHeight: {
              xs: `calc(100vh - ${headerHeight} - ${t.spacing(2)})`,
              md: `100%`,
            },
          })}
        >
          <NoSsr>
            {module === "atpl" && (
              <RightContainer container xs={6}>
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
                  enabling you to practice challenging questions repeatedly and
                  promptly skip variants of questions you already comprehend.
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ pt: 2 }}>
                  <Grid xs={12} lg={6}>
                    <Button
                      fullWidth
                      size="lg"
                      component={Link}
                      children={"Explore Learning Objectives"}
                      href="/modules/atpl/learning-objectives"
                    />
                  </Grid>
                  <Grid xs={12} lg={6}>
                    <Button
                      fullWidth
                      size="lg"
                      component={Link}
                      children={"Explore Questions"}
                      href="/modules/atpl/questions"
                    />
                  </Grid>
                  <Grid xs={12} lg={6}>
                    <Button
                      fullWidth
                      size="lg"
                      component={Link}
                      children={"Create a Test"}
                      href="/modules/atpl/tests/create"
                    />
                  </Grid>
                  <Grid xs={12} lg={6}>
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
            {module === "prep" && (
              <RightContainer container xs={6}>
                <Typography
                  level="h3"
                  component="h2"
                  sx={{ fontSize: { md: "3em" }, lineHeight: 1.2 }}
                >
                  {`Prepare your next interview with `}
                  <CountUp
                    component={"span"}
                    end={numberOfFlashcards}
                    duration={2000}
                    sx={{
                      color: "primary.500",
                      width: "1.8em",
                      display: "inline-flex",
                      justifyContent: "flex-end",
                    }}
                  />
                  {` flashcards`}
                </Typography>
                <Typography level="h4" component="p" sx={{ mt: 2 }}>
                  When you get to your first job interview, you won&apos;t have
                  the benefit of being able to select the best out of 4 answers.
                  You will have to explain the topics you have learned in the
                  theory classes without any crutches. <br />
                  Use our flash cards to practice answering open ended questions
                  and secure your first job.
                </Typography>
                <Button
                  fullWidth
                  size="lg"
                  component={Link}
                  children={"Explore Flash Cards"}
                  href="/modules/prep/flashcards"
                  sx={{ my: 2 }}
                />
              </RightContainer>
            )}
            {module === "737" && (
              <RightContainer container xs={6}>
                <Typography
                  level="h3"
                  component="h2"
                  sx={{ fontSize: { md: "3em" }, lineHeight: 1.2 }}
                >
                  {`Prepare your next Type Rating exam`}
                </Typography>
                <Typography level="h4" component="p" sx={{ mt: 2 }}>
                  Review the most commonly asked tech knowledge questions for
                  the 2 most popular aircraft in the world: the Airbus A320 and
                  Boeing 737
                </Typography>
                <Grid container spacing={2} sx={{ pt: 2 }}>
                  <Grid xs={12} sm={6}>
                    <Button
                      fullWidth
                      size="lg"
                      component={Link}
                      children={"Explore 737 Questions"}
                      href="/modules/737/questions"
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Button
                      fullWidth
                      size="lg"
                      component={Link}
                      variant="outlined"
                      children={"Create 737 Test"}
                      href="/modules/737/tests/create"
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Button
                      fullWidth
                      size="lg"
                      component={Link}
                      children={"Explore A320 Questions"}
                      href="/modules/737/questions"
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Button
                      fullWidth
                      size="lg"
                      component={Link}
                      variant="outlined"
                      children={"Create A320 Test"}
                      href="/modules/737/tests/create"
                    />
                  </Grid>
                </Grid>
              </RightContainer>
            )}
          </NoSsr>
        </Box>
      </Box>
    </LayoutPublic>
  );
};

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  await preloadContentForStaticRender(await import("fs/promises"));

  const helper = await getTrpcHelper();
  const [
    { count: numberOfFlashcards },
    { count: numberOfAtplQuestions },
    { count: numberOf737Questions },
    { count: numberOfA320Questions },
  ] = await Promise.all([
    helper.interviewPrep.getNumberOfFlashcards.fetch(),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "atpl" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "737" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "a320" }),
  ]);

  return {
    props: {
      numberOfFlashcards,
      numberOfAtplQuestions,
      numberOf737Questions,
      numberOfA320Questions,
    },
  };
};

export default IndexPage;
