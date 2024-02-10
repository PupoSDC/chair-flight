import { useRef } from "react";
import { NoSsr } from "@mui/base";
import { default as AirplaneTicketIcon } from "@mui/icons-material/AirplaneTicket";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as FlightTakeoffIcon } from "@mui/icons-material/FlightTakeoff";
import { default as StyleIcon } from "@mui/icons-material/Style";
import { Button, Box, Divider, Grid, Link, Typography } from "@mui/joy";
import {
  CountUp,
  ModuleSelectionButton,
  Typical,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container } from "@chair-flight/trpc/client";
import { RightContainer } from "./welcome-right-container";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = {
  headerHeight?: number;
  questionBank?: QuestionBankName;
  onQuestionBankChanged: (questionBank: QuestionBankName) => void;
};

type Data = AppRouterOutput["containers"]["overviews"]["getOverviewWelcome"];

type Params = Record<string, never>;

export const OverviewWelcome = container<Props, Params, Data>(
  ({
    questionBank,
    onQuestionBankChanged,
    sx,
    headerHeight = 0,
    component = "section",
  }) => {
    const rightSideContainer = useRef<HTMLDivElement>(null);
    const { numberOfFlashcards, numberOfAtplQuestions, numberOfTypeQuestions } =
      OverviewWelcome.useData({});

    const mediaLongScreen = "@media (min-height: 560px) and (min-width: 440px)";

    const goToTheme = (theme: QuestionBankName) => {
      onQuestionBankChanged(theme);
      const top = rightSideContainer.current?.offsetTop ?? 0;
      setTimeout(
        () => window.scrollTo({ top: top - 50, behavior: "smooth" }),
        200,
      );
    };

    return (
      <Box
        component={component}
        sx={{
          display: "flex",
          p: {
            xs: 2,
            md: 4,
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          height: {
            xs: "100%",
            md: `calc(100vh - ${headerHeight}px)`,
          },
          maxWidth: 1240,
          mx: "auto",
          position: "relative",

          ...sx,
        }}
      >
        <Box
          sx={(t) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mx: "auto",

            justifyContent: {
              xs: "space-around",
              md: "center",
            },
            minHeight: {
              xs: `calc(100vh - ${headerHeight}px - ${t.spacing(2)})`,
              md: `calc(100vh - ${headerHeight}px - ${t.spacing(4)})`,
            },
            maxWidth: {
              xs: 620,
              md: `calc(${460}px - ${t.spacing(2)})`,
              lg: `calc(${620}px - ${t.spacing(2)})`,
            },
            position: {
              xs: "relative",
              md: "absolute",
            },
            top: {
              xs: "initial",
              md: "50%",
            },
            transform: {
              xs: "none",
              md: `translate(0, -50%)`,
            },
            "& > *": {
              mb: 1,
              [mediaLongScreen]: { mb: 2 },
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
                [mediaLongScreen]: { fontSize: "3em" },
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
              active={questionBank === "atpl"}
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
              active={questionBank === "prep"}
              icon={<StyleIcon />}
              onClick={() => goToTheme("prep")}
              showMoreHref="/modules/prep"
            />
            <ModuleSelectionButton
              fullWidth
              sx={{ mb: { xs: 1, md: 2 } }}
              color={"rose"}
              title={"Type Rating"}
              active={["type"].includes(questionBank ?? "")}
              description={[
                `Prepare or review your theory knowledge for a type rating `,
                `on the Boeing 737 or the Airbus A320 with `,
                `${numberOfTypeQuestions} questions.`,
              ].join("")}
              icon={<FlightTakeoffIcon />}
              onClick={() => goToTheme("type")}
              showMoreHref="/modules/type"
            />
          </Box>
          <Link
            sx={{ justifyContent: "center", width: "100%" }}
            href="/blog/000-about-us"
            children="About This Project"
            endDecorator={<ChevronRightIcon />}
          />
        </Box>
        <Divider sx={{ my: 2, display: { sm: "none" } }} />
        {questionBank && (
          <Box
            ref={rightSideContainer}
            sx={(t) => ({
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mx: "auto",
              width: "100%",
              minHeight: {
                xs: `calc(100vh - ${headerHeight}px - ${t.spacing(2)})`,
                md: `calc(100vh - ${headerHeight}px - ${t.spacing(4)})`,
              },
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
            })}
          >
            <NoSsr>
              {questionBank === "atpl" && (
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
                    enabling you to practice challenging questions repeatedly
                    and promptly skip variants of questions you already
                    comprehend.
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
              {questionBank === "prep" && (
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
                    When you get to your first job interview, you won&apos;t
                    have the benefit of being able to select the best out of 4
                    answers. You will have to explain the topics you have
                    learned in the theory classes without any crutches. <br />
                    Use our flash cards to practice answering open ended
                    questions and secure your first job.
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
              {questionBank === "type" && (
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
                    the 2 most popular aircraft in the world: the Airbus A320
                    and Boeing 737
                  </Typography>
                  <Grid container spacing={2} sx={{ pt: 2 }}>
                    <Grid xs={12}>
                      <Button
                        fullWidth
                        size="lg"
                        component={Link}
                        children={"Explore Type Rating Questions"}
                        href="/modules/type/questions"
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Button
                        fullWidth
                        size="lg"
                        component={Link}
                        children={"Create Type Rating Test"}
                        href="/modules/type/tests/create"
                      />
                    </Grid>
                  </Grid>
                </RightContainer>
              )}
            </NoSsr>
          </Box>
        )}
      </Box>
    );
  },
);

OverviewWelcome.displayName = "OverviewWelcome";

OverviewWelcome.getData = async ({ helper }) => {
  const router = helper.containers.overviews;
  return await router.getOverviewWelcome.fetch({});
};

OverviewWelcome.useData = () => {
  const router = trpc.containers.overviews;
  return router.getOverviewWelcome.useSuspenseQuery({})[0];
};
