import { useRouter } from "next/router";
import {
  DialogContent,
  DialogTitle,
  Drawer,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import {
  TestFinisher,
  TestHeader,
  TestNavigation,
  TestQuestion,
} from "@cf/next/tests";
import { UserBugReport } from "@cf/next/user";
import { AppHead, useDisclose } from "@cf/react/components";
import { ThemeOverrideColorScheme } from "@cf/react/theme";
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
  const questionNavSidebar = useDisclose();
  const finishModal = useDisclose();

  const navigateToReview = () => {
    router.push(`/modules/${questionBank}/tests/${testId}/review`);
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
        onFinishClicked={finishModal.open}
      />
      <TestQuestion noSsr mode="exam" testId={testId} />

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
