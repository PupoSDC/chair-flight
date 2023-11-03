import { useRouter } from "next/router";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import {
  Link,
  List,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Sheet,
  listItemButtonClasses,
} from "@mui/joy";
import { HEADER_HEIGHT, Header } from "@chair-flight/react/components";
import {
  AppHead,
  QuestionSearch,
  TestMaker,
  useTestProgress,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

const QuestionsIndexPage: NextPage = () => {
  const router = useRouter();
  const addTest = useTestProgress((s) => s.addTest);
  const isQuestions = router.asPath.includes("questions");
  const isTests = router.asPath.includes("tests");
  const isHome = !isQuestions && !isTests;

  return (
    <>
      <AppHead />
      <Header borderStyle="outlined" />
      <main>
        <Sheet
          sx={{
            position: "fixed",
            width: 260,
            height: "100%",
            overflow: "auto",
            borderTop: 0,
            borderBottom: 0,
            borderLeft: 0,
            borderRadius: 0,
          }}
        >
          <List
            sx={{
              p: 0,
              [`& > .${listItemButtonClasses.root}`]: {
                py: 2,
                borderRight: 0,
                borderLeft: 4,
                borderLeftColor: "transparent",

                "&:first-of-type": {
                  borderTop: 0,
                },
                "&:not(:last-of-type)": {
                  borderBottom: 0,
                },
                "&:hover": {
                  textDecoration: "none",
                },
                "&:focus-visible": {
                  outline: "none !important",
                  textDecoration: "underline",
                },
                [`&.${listItemButtonClasses.selected}`]: {
                  color: "var(--joy-palette-primary-plainColor)",
                  borderLeftColor: "var(--joy-palette-primary-plainColor)",
                  bgcolor: "transparent",
                },
              },
            }}
          >
            <ListItemButton
              variant="outlined"
              selected={isHome}
              component={Link}
              href={"./"}
            >
              <ListItemDecorator>
                <FlightTakeoffIcon sx={{ fontSize: 24 }} />
              </ListItemDecorator>
              <ListItemContent>Home</ListItemContent>
            </ListItemButton>
            <ListItemButton
              variant="outlined"
              selected={isQuestions}
              component={Link}
              href={"./questions"}
            >
              <ListItemDecorator>
                <FlightTakeoffIcon sx={{ fontSize: 24 }} />
              </ListItemDecorator>
              <ListItemContent>Search Questions</ListItemContent>
            </ListItemButton>
            <ListItemButton
              variant="outlined"
              selected={isTests}
              component={Link}
              href={"./tests"}
            >
              <ListItemDecorator>
                <FlightTakeoffIcon sx={{ fontSize: 24 }} />
              </ListItemDecorator>
              <ListItemContent>Create Test</ListItemContent>
            </ListItemButton>
          </List>
        </Sheet>
        {isQuestions && (
          <QuestionSearch
            searchQuestions={trpc.questionBank737.searchQuestions}
            getNumberOfQuestions={trpc.questionBank737.getNumberOfQuestions}
            sx={{
              minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
              width: "calc(100% - 260px)",
              ml: "260px",
              p: 2,
            }}
          />
        )}
        {isTests && (
          <TestMaker
            createTest={trpc.questionBank737.createTest}
            getAllSubjects={trpc.questionBank737.getAllSubjects}
            testPersistenceKey="cf-test-maker-737"
            onSuccessfulTestCreation={(test) => {
              addTest({ test });
              router.push(`./tests/${test.id}/${test.mode}`);
            }}
            sx={{
              height: `calc(100vh - ${HEADER_HEIGHT}px)`,
              width: "calc(100% - 260px)",
              ml: "260px",
              p: 2,
            }}
          />
        )}
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const helper = await getTrpcHelper();
  await Promise.all([
    helper.questionBank737.getAllSubjects.fetch(),
    helper.questionBank737.getNumberOfQuestions.fetch(),
  ]);

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { home: [] } },
      { params: { home: ["questions"] } },
      { params: { home: ["tests"] } },
    ],
    fallback: "blocking",
  };
};

export default QuestionsIndexPage;
