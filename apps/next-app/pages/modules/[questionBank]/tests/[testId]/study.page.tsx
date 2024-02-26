import { useRouter } from "next/router";
import {
  DialogContent,
  DialogTitle,
  Drawer,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { AppHead } from "@cf/next/public";
import {
  TestFinisher,
  TestHeader,
  TestNavigation,
  TestQuestion,
  TestQuestionMeta,
} from "@cf/next/tests";
import { UserBugReport } from "@cf/next/user";
import { ThemeOverrideColorScheme } from "@cf/react/theme";
import { useDisclose } from "@cf/react/ui";
import { ssrHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { NextPage } from "next";

type Props = {
  testId: string;
  questionBank: QuestionBankName;
};

type Params = {
  testId: string;
  questionBank: QuestionBankName;
};

export const Page: NextPage<Props> = ({ testId, questionBank }) => {
  const router = useRouter();
  const metaSidebar = useDisclose();
  const questionNavSidebar = useDisclose();
  const finishModal = useDisclose();

  const navigateToReview = () => {
    router.push(`/modules/${questionBank}/tests/${testId}/review`);
  };

  const navigateToTestSearch = () => {
    router.push(`/modules/${questionBank}/tests`);
  };

  return (
    <>
      <AppHead />
      <ThemeOverrideColorScheme questionBank={questionBank} />
      <TestHeader
        noSsr
        testId={testId}
        timerMode="timeSpent"
        onQuestionsClicked={questionNavSidebar.open}
        onMetaClicked={metaSidebar.open}
        onFinishClicked={finishModal.open}
      />
      <TestQuestion noSsr mode="study" testId={testId} />
      <Drawer
        anchor="right"
        open={metaSidebar.isOpen}
        onClose={metaSidebar.close}
        sx={{ "--Drawer-horizontalSize": "640px" }}
      >
        <ModalClose />
        <DialogTitle>Question Meta</DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <TestQuestionMeta noSsr testId={testId} questionBank={questionBank} />
        </DialogContent>
      </Drawer>
      <Drawer
        anchor="right"
        open={questionNavSidebar.isOpen}
        onClose={questionNavSidebar.close}
        sx={{ "--Drawer-horizontalSize": "460px" }}
      >
        <ModalClose />
        <DialogTitle>Question Navigation</DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <TestNavigation
            noSsr
            testId={testId}
            onNavigation={questionNavSidebar.close}
            onTestFinished={navigateToReview}
          />
        </DialogContent>
      </Drawer>
      <Modal open={finishModal.isOpen} onClose={finishModal.close}>
        <ModalDialog>
          <ModalClose />
          <DialogContent sx={{ p: 2 }}>
            <TestFinisher
              noSsr
              testId={testId}
              onTestDismissed={navigateToTestSearch}
              onTestFinished={navigateToReview}
            />
          </DialogContent>
        </ModalDialog>
      </Modal>
      <UserBugReport />
    </>
  );
};

export const getServerSideProps = ssrHandler<Props, Params>(
  async ({ params }) => ({ props: params }),
);

export default Page;
