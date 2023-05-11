import { useState } from "react";
import {
  Modal,
  ModalDialog,
  ModalClose,
  ModalOverflow,
  Typography,
  Divider,
} from "@mui/joy";
import { ReduxProvider } from "@chair-flight/core/redux";
import {
  AlphaWarning,
  AppHead,
  AppHeaderMenu,
} from "@chair-flight/next/client";
import { ssrHandler } from "@chair-flight/next/server";
import { AppLayout, Header } from "@chair-flight/react/components";
import { TestCreation } from "./components/test-creation";
import { PreviewTests } from "./components/tests-overview";
import type { NextPage } from "next";
import type { LearningObjectiveSummary } from "@chair-flight/base/types";

type TestPageProps = {
  subjects: LearningObjectiveSummary[];
};

const TestPage: NextPage<TestPageProps> = ({ subjects }) => {
  const [testCreationOpen, setTestCreationOpen] = useState(false);

  return (
    <>
      <AppHead />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main sx={{ maxWidth: (t) => t.breakpoints.values.lg }}>
        <ReduxProvider loading={"loading..."}>
          <AlphaWarning />
          <PreviewTests />
          <AppLayout.Grid></AppLayout.Grid>
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
