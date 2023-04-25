import {
  Box,
  styled,
  GlobalStyles,
  Typography,
  Button,
  Link,
  Grid,
} from "@mui/joy";
import {
  AppHead,
  QuestionPreview,
  LandingScreen,
} from "@chair-flight/next/components";
import { staticHandler } from "@chair-flight/next/server";
import { Header, HEADER_HEIGHT } from "@chair-flight/react/components";
import type { NextPage } from "next";
import type { QuestionTemplate } from "@chair-flight/base/types";

const sectionHeight = `calc(100vh - ${HEADER_HEIGHT}px)`;

const StyledMain = styled("main")`
  scroll-snap-type: y mandatory;
  overflow: scroll;
  height: calc(100vh - ${HEADER_HEIGHT}px);
`;

const StyledSection = styled(Box)`
  position: relative;
  min-height: ${sectionHeight};
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(0)};
  scroll-snap-align: start;
`;

StyledSection.defaultProps = {
  component: "section",
};

export type IndexPageProps = {
  numberOfQuestions: number;
  demoQuestion: QuestionTemplate;
};

export const IndexPage: NextPage<IndexPageProps> = ({
  demoQuestion,
  numberOfQuestions,
}) => (
  <>
    <AppHead />
    <Header />
    <StyledMain>
      <StyledSection>
        <LandingScreen />
      </StyledSection>
      <StyledSection sx={{ backgroundColor: "background.backdrop" }}>
        <QuestionPreview
          numberOfQuestions={numberOfQuestions}
          questionTemplate={demoQuestion}
        />
      </StyledSection>
      <StyledSection sx={{ flexDirection: "column", justifyContent: "center" }}>
        <Typography level="h2" sx={{ textAlign: "center" }}>
          Explore the Alpha functionalities
        </Typography>
        <Grid
          spacing={{ xs: 2, sm: 4 }}
          container
          sx={{
            py: 4,
            width: "100%",
            maxWidth: (t) => t.breakpoints.values.md,
          }}
        >
          <Grid xs={12} sm={4}>
            <Button
              variant="outlined"
              component={Link}
              href="/questions"
              fullWidth
            >
              Search Questions
            </Button>
          </Grid>
          <Grid xs={12} sm={4}>
            <Button variant="outlined" component={Link} href="/tests" fullWidth>
              Create a Test
            </Button>
          </Grid>
          <Grid xs={12} sm={4}>
            <Button
              variant="outlined"
              component={Link}
              href="/learning-objectives"
              fullWidth
            >
              Search Learning Objectives
            </Button>
          </Grid>
        </Grid>
      </StyledSection>
    </StyledMain>
    <GlobalStyles
      styles={{
        "html, body, #__next": {
          height: "100vh",
          overflow: "hidden",
        },
      }}
    />
  </>
);

export const getStaticProps = staticHandler(async ({ questionBank }) => {
  const allQuestions = await questionBank.getAllQuestionTemplates();
  const demoQuestion = await questionBank.getQuestionTemplate("QYFPA3CY4E");

  return {
    props: {
      numberOfQuestions: allQuestions.length,
      demoQuestion,
    },
  };
});

export default IndexPage;
