import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Link,
  Modal,
  ModalDialog,
  ModalClose,
  ModalOverflow,
  Typography,
  Divider,
} from "@mui/joy";
import dedent from "ts-dedent";
import {
  ReduxProvider,
  useAppSelector,
  useUserVoyageFlag,
} from "@chair-flight/core/redux";
import { AppHead, AppHeaderMenu } from "@chair-flight/next/components";
import { ssrHandler } from "@chair-flight/next/server";
import {
  AppLayout,
  Header,
  TestPreview,
  toast,
} from "@chair-flight/react/components";
import { TestCreation } from "./components/test-creation";
import type { NextPage } from "next";
import type { FunctionComponent } from "react";
import type { LearningObjectiveSummary } from "@chair-flight/base/types";

type TestPageProps = {
  subjects: LearningObjectiveSummary[];
};

const PreviewTests: FunctionComponent = () => {
  const tests = useAppSelector((store) => store.testProgress.tests);
  const testsAsList = Object.values(tests).sort(
    (a, b) => b.createdAtEpochMs - a.createdAtEpochMs
  );

  return (
    <AppLayout.ScrollableContainer component="ul" sx={{ py: 0 }}>
      {testsAsList.map((test) => (
        <Box component="li" sx={{ pb: 1 }} key={test.id}>
          <TestPreview
            component={Link}
            href={`/tests/${test.id}/${
              test.status === "finished" ? "review" : "exam"
            }`}
            title={test.title}
            status={test.status}
            numberOfQuestions={test.questions.length}
            epochTimeInMs={test.createdAtEpochMs}
            timeToCompleteInMs={test.timeSpentInMs / 1000}
            timeLeftInMs={(test.durationInMs - test.timeSpentInMs) / 1000}
            score={
              test.questions.reduce(
                (s, q) =>
                  s + (q.selectedOptionId === q.correctOptionId ? 1 : 0),
                0
              ) / test.questions.length
            }
          />
        </Box>
      ))}
    </AppLayout.ScrollableContainer>
  );
};

const AlphaWarning: FunctionComponent = () => {
  const [hasSeenAlphaFlag, setHasSeenAlphaFlag] = useUserVoyageFlag(
    "has-seen-alpha-warning"
  );

  useEffect(() => {
    setTimeout(() => {
      if (hasSeenAlphaFlag) return;
      setHasSeenAlphaFlag(true);
      toast.warn(
        dedent`
        Chair Flight is still in alpha.
        All data created by you is stored in your browser only and will be periodically deleted.
      `,
        {
          duration: 10000,
        }
      );
    }, 3000);
  }, [hasSeenAlphaFlag, setHasSeenAlphaFlag]);

  return null;
};

const TestPage: NextPage<TestPageProps> = ({ subjects }) => {
  const [testCreationOpen, setTestCreationOpen] = useState(false);

  return (
    <>
      <AppHead />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main>
        <ReduxProvider loading={"loading..."}>
          <AppLayout.Grid>
            <AppLayout.Column xs={12} md={3}>
              <Button
                sx={{ my: 1, display: { md: "none" } }}
                children="Create New Test"
                onClick={() => setTestCreationOpen(true)}
              />
              <Divider sx={{ mb: 0.5, display: { md: "none" } }} />
              <ReduxProvider loading={"loading..."}>
                <PreviewTests />
                <AlphaWarning />
              </ReduxProvider>
            </AppLayout.Column>
            <AppLayout.Column
              md={9}
              sx={{
                display: { xs: "none", md: "flex" },
                height: "100%",
              }}
            >
              <TestCreation subjects={subjects} />
            </AppLayout.Column>
          </AppLayout.Grid>
          <Modal
            open={testCreationOpen}
            onClose={() => setTestCreationOpen(false)}
          >
            <ModalOverflow>
              <ModalDialog>
                <ModalClose />
                <Typography level="h4">Create Test</Typography>
                <Divider sx={{ mb: 2 }} />
                <TestCreation subjects={subjects} />
              </ModalDialog>
            </ModalOverflow>
          </Modal>
        </ReduxProvider>
      </AppLayout.Main>
    </>
  );
};

export const getStaticProps = ssrHandler<TestPageProps>(
  async ({ questionBank }) => {
    const subjects = (await questionBank.getSubjects()).filter(
      (lo) => !["034", "082"].includes(lo.id)
    );

    return {
      props: {
        subjects,
      },
    };
  }
);

export default TestPage;
