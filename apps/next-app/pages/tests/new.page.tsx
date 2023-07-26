import { default as Image } from "next/image";
import { Box, Typography } from "@mui/joy";
import { ReduxProvider } from "@chair-flight/core/redux";
import { AppLayout, Header } from "@chair-flight/react/components";
import {
  AlphaWarning,
  AppHead,
  AppHeaderMenu,
} from "@chair-flight/react/containers";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import { TestCreation } from "./components/test-creation";
import type { LearningObjectiveSummary } from "@chair-flight/base/types";
import type { GetStaticProps, NextPage } from "next";

type NewTestPageProps = {
  subjects: LearningObjectiveSummary[];
};

const NewTestPage: NextPage<NewTestPageProps> = ({ subjects }) => {
  return (
    <>
      <AppHead />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.BackgroundImageContainer>
        <Image
          src="/images/background-test-creation.png"
          fill
          alt="cool cockpit"
        />
      </AppLayout.BackgroundImageContainer>
      <AppLayout.Main
        sx={{
          maxWidth: (t) => t.breakpoints.values.md,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ReduxProvider loading={"loading..."}>
          <AlphaWarning />
          <AppLayout.Header>
            <Typography level="h2">New Test</Typography>
          </AppLayout.Header>
          <Box sx={{ flex: 1, height: 100, pb: 2 }}>
            <TestCreation subjects={subjects} />
          </Box>
        </ReduxProvider>
      </AppLayout.Main>
    </>
  );
};

export const getStaticProps: GetStaticProps<NewTestPageProps> = async () => {
  const helper = await getTrpcHelper();
  const subjects = (await helper.tests.getAllSubjects.fetch()).filter(
    (lo) => !["034", "082"].includes(lo.id),
  );
  return {
    props: {
      subjects,
    },
  };
};

export default NewTestPage;
