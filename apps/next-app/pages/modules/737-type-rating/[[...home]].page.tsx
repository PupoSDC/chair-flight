import { useRouter } from "next/router";
import { default as AddCircleIcon } from "@mui/icons-material/AddCircle";
import { default as ConnectingAirportsIcon } from "@mui/icons-material/ConnectingAirports";
import { default as SearchIcon } from "@mui/icons-material/Search";
import { useTheme } from "@mui/joy";
import {
  HEADER_HEIGHT,
  Header,
  SidebarDrawer,
  SidebarDrawerListItem,
} from "@chair-flight/react/components";
import {
  AppHead,
  QuestionSearch,
  TestMaker,
  useTestProgress,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

const HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

const QuestionsIndexPage: NextPage = () => {
  const router = useRouter();
  const addTest = useTestProgress((s) => s.addTest);
  const theme = useTheme();
  const isQuestions = router.asPath.includes("questions");
  const isTests = router.asPath.includes("tests");
  const isHome = !isQuestions && !isTests;
  const mainContentSx = {
    minHeight: HEIGHT,
    width: `var(${theme.dimensions.vars.sidebarRemainingWidth})`,
    marginLeft: "auto",
    marginRight: 0,
    p: { xs: 0.5, md: 2 },
    transition: "margin-left 0.25s, width 0.25s",
  };

  return (
    <>
      <AppHead />
      <Header borderStyle="outlined" />
      <main>
        <SidebarDrawer sx={{ height: HEIGHT }}>
          <SidebarDrawerListItem
            href={"./"}
            selected={isHome}
            icon={ConnectingAirportsIcon}
            title={"Home"}
          />
          <SidebarDrawerListItem
            href={"./questions"}
            selected={isQuestions}
            icon={SearchIcon}
            title={"Search Questions"}
          />
          <SidebarDrawerListItem
            href={"./tests"}
            selected={isTests}
            icon={AddCircleIcon}
            title={"Create Test"}
          />
        </SidebarDrawer>
        {isQuestions && (
          <QuestionSearch
            component={"section"}
            searchQuestions={trpc.questionBank737.searchQuestions}
            getNumberOfQuestions={trpc.questionBank737.getNumberOfQuestions}
            sx={mainContentSx}
          />
        )}
        {isTests && (
          <TestMaker
            createTest={trpc.questionBank737.createTest}
            getAllSubjects={trpc.questionBank737.getAllSubjects}
            testPersistenceKey="cf-test-maker-737"
            sx={mainContentSx}
            onSuccessfulTestCreation={(test) => {
              addTest({ test });
              router.push(`./tests/${test.id}/${test.mode}`);
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
