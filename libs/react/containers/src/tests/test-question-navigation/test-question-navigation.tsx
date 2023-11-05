import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Typography,
  useTheme,
} from "@mui/joy";
import {
  QuestionNavigation,
  useMediaQuery,
} from "@chair-flight/react/components";
import { useTestProgress } from "../use-test-progress";
import type { RefAttributes, ExoticComponent } from "react";

export type TestQuestionNavigationProps = {
  testId: string;
};

export type TestQuestionNavigationRef = HTMLDListElement & {
  open: () => void;
};

export type TestQuestionNavigationComponent = ExoticComponent<
  TestQuestionNavigationProps & RefAttributes<TestQuestionNavigationRef>
>;

export const TestQuestionNavigation: TestQuestionNavigationComponent =
  forwardRef<TestQuestionNavigationRef, TestQuestionNavigationProps>(
    ({ testId }, ref) => {
      const [isModalOpen, setModalOpen] = useState(false);
      const test = useTestProgress((state) => state.tests[testId]);
      const theme = useTheme();
      const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
      const isSmVerticalScreen = useMediaQuery("(max-height: 600px)");
      const router = useRouter();
      const goToQuestion = useTestProgress((s) => s.navigateToTestQuestion);
      const finishTest = useTestProgress((s) => s.finishTest);

      useImperativeHandle(
        ref,
        () =>
          ({
            open: () => setModalOpen(true),
          }) as TestQuestionNavigationRef,
      );

      useEffect(() => setModalOpen(false), [isMdScreen]);

      if (!test) throw new Error(`Test with id ${testId} not found`);

      const question = test.questions[test.currentQuestionIndex];
      const status =
        test.mode === "exam" ? "in-progress" : "in-progress-with-results";

      const navigation = (
        <>
          <QuestionNavigation
            sx={{ width: "100%" }}
            status={status}
            pageSize={isSmVerticalScreen ? 36 : 80}
            currentId={question.questionId}
            questions={test.questions.map((q) => ({
              id: q.questionId,
              selectedOption: q.selectedOptionId,
              correctOption: q.correctOptionId,
            }))}
            onQuestionClicked={(questionId) => {
              goToQuestion({ testId: test.id, questionId });
            }}
          />
          <Button
            fullWidth
            sx={{ mt: 2 }}
            children="Finish"
            onClick={() => {
              finishTest({ testId: test.id });
              router.push(`../${test.id}/review`);
            }}
          />
        </>
      );

      return isMdScreen ? (
        <Sheet sx={{ p: 2 }}>{navigation}</Sheet>
      ) : (
        <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
          <ModalDialog sx={{ maxWidth: 600, width: "calc(100% - 16px)" }}>
            <Typography level="h4" mb={1}>
              Navigation
            </Typography>
            <ModalClose variant="plain" sx={{ m: 1, overflowY: "auto" }} />
            {navigation}
          </ModalDialog>
        </Modal>
      );
    },
  );
