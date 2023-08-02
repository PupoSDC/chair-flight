import { default as Image } from "next/image";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/joy";
import { AppLayout, Header } from "@chair-flight/react/components";
import {
  AlphaWarning,
  AppHead,
  AppHeaderMenu,
  TestMaker,
  useTestProgress,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

const NewTestPage: NextPage = () => {
  const router = useRouter();
  const addTest = useTestProgress((s) => s.addTest);
  return (
    <>
      <AppHead />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.BackgroundImageContainer>
        <Image
          src="/images/background-test-creation.png"
          alt="cool cockpit"
          fill
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
        <AppLayout.Header>
          <Typography level="h2">New Test</Typography>
        </AppLayout.Header>
        <Box sx={{ flex: 1, height: 100, pb: 2 }}>
          <TestMaker
            onSuccessfulTestCreation={(test) => {
              addTest({ test });
              router.push(`/tests/${test.id}/${test.mode}`);
            }}
          />
        </Box>
        <AlphaWarning />
      </AppLayout.Main>
    </>
  );
};

export const getStaticProps = ssrHandler(async ({ helper }) => {
  await helper.tests.getAllSubjects.prefetch();
});

export default NewTestPage;
