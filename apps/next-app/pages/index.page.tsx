import { Box, styled, GlobalStyles } from "@mui/joy";
import { Header, HEADER_HEIGHT } from "@chair-flight/react/components";
import {
  AppHead,
  QuestionPreview,
  LandingScreen,
  CoolSlidingThing,
  AlphaPreview,
  FlashCardPreview,
} from "@chair-flight/react/containers";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type {
  FlashCardContent,
  QuestionTemplate,
} from "@chair-flight/base/types";
import type { BoxProps } from "@mui/joy";
import type { GetStaticProps, NextPage } from "next";

const sectionHeight = `calc(100vh - ${HEADER_HEIGHT}px)`;

const StyledMain = styled("main")`
  scroll-snap-type: y mandatory;
  overflow: scroll;
  height: calc(100vh - ${HEADER_HEIGHT}px);
`;

const Section = (props: BoxProps) => <Box component="section" {...props} />;

const StyledSection = styled(Section)`
  position: relative;
  min-height: ${sectionHeight};
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(0)};
  scroll-snap-align: start;
` as typeof Box;

const StyledSectionA = styled(StyledSection)`
  background-color: ${({ theme }) => theme.vars.palette.background.body};
`;

const StyledSectionB = styled(StyledSection)`
  background-color: ${({ theme }) => theme.vars.palette.primary.softBg};
`;

export type IndexPageProps = {
  numberOfQuestions: number;
  numberOfFlashCards: number;
  demoQuestion: QuestionTemplate;
  demoFlashCard: FlashCardContent;
};

export const IndexPage: NextPage<IndexPageProps> = ({
  demoQuestion,
  numberOfQuestions,
  demoFlashCard,
  numberOfFlashCards,
}) => (
  <>
    <AppHead
      linkDescription={[
        "Chair Flight is a community driven Aviation Question Bank built by students for students. ",
        "Now available for Alpha testing. Explore ${numberOfQuestions} questions, create tests, and ",
        "improve your knowledge... for free!",
      ].join("")}
    />
    <Header />
    <StyledMain>
      <CoolSlidingThing />
      <StyledSection>
        <LandingScreen />
      </StyledSection>
      <StyledSectionB>
        <QuestionPreview
          numberOfQuestions={numberOfQuestions}
          questionTemplate={demoQuestion}
        />
      </StyledSectionB>
      <StyledSectionA>
        <FlashCardPreview
          flashCard={demoFlashCard}
          numberOfFlashCards={numberOfFlashCards}
        />
      </StyledSectionA>
      <StyledSectionB>
        <AlphaPreview />
      </StyledSectionB>
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

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  const helper = await getTrpcHelper();
  const flashCardId = "3b1ba81a-df7a-4e9a-a04d-c15a09820eb0";
  const questionId = "QYFPA3CY4E";
  const [
    { numberOfQuestions },
    { numberOfFlashCards },
    { questionTemplate: demoQuestion },
    { flashCard: demoFlashCard },
  ] = await Promise.all([
    helper.questions.getNumberOfQuestions.fetch(),
    helper.interviewPrep.getNumberOfFlashCards.fetch(),
    helper.questions.getQuestion.fetch({ questionId }),
    helper.interviewPrep.getFlashCard.fetch({ flashCardId }),
  ]);

  return {
    props: {
      numberOfQuestions,
      numberOfFlashCards,
      demoQuestion,
      demoFlashCard,
    },
  };
};

export default IndexPage;
