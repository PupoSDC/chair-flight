import { Box, styled, GlobalStyles } from "@mui/joy";
import dedent from "ts-dedent";
import { NotFoundError } from "@chair-flight/base/errors";
import {
  AppHead,
  QuestionPreview,
  LandingScreen,
  CoolSlidingThing,
  AlphaPreview,
  FlashCardPreview,
} from "@chair-flight/next/client";
import { staticHandler } from "@chair-flight/next/server";
import { Header, HEADER_HEIGHT } from "@chair-flight/react/components";
import type {
  FlashCardContent,
  QuestionTemplate,
} from "@chair-flight/base/types";
import type { NextPage } from "next";

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

const StyledSectionA = styled(StyledSection)`
  background-color: ${({ theme }) => theme.vars.palette.background.body};
`;

const StyledSectionB = styled(StyledSection)`
  background-color: ${({ theme }) => theme.vars.palette.primary.softBg};
`;

export type IndexPageProps = {
  numberOfQuestions: number;
  demoQuestion: QuestionTemplate;
  flashCard: FlashCardContent;
  numberOfFlashCards: number;
};

export const IndexPage: NextPage<IndexPageProps> = ({
  demoQuestion,
  numberOfQuestions,
  flashCard,
  numberOfFlashCards,
}) => (
  <>
    <AppHead
      linkDescription={dedent`
        Chair Flight is a community driven Aviation Question Bank built by students for students.
        Now available for Alpha testing. Explore ${numberOfQuestions} questions, create tests, and
        improve your knowledge... for free!
      `}
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
          flashCard={flashCard}
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

export const getStaticProps = staticHandler<IndexPageProps>(
  async ({ questionBank }) => {
    const allQuestions = await questionBank.getAllQuestionTemplates();
    const demoQuestion = await questionBank.getQuestionTemplate("QYFPA3CY4E");
    const allFlashCards = await questionBank.getAllFlashCards();
    const allFlashCardsArray = Object.values(allFlashCards).flat();
    const numberOfFlashCards = allFlashCardsArray.length;
    const flashCard = allFlashCardsArray.find(
      (f) => f.id === "3b1ba81a-df7a-4e9a-a04d-c15a09820eb0"
    );
    if (!flashCard) throw new NotFoundError("Missing showcase flash card!");

    return {
      props: {
        numberOfQuestions: allQuestions.length,
        demoQuestion,
        numberOfFlashCards,
        flashCard,
      },
    };
  }
);

export default IndexPage;
