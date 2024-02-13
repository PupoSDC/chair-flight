import { useState } from "react";
import { default as AccessAlarmsOutlinedIcon } from "@mui/icons-material/AccessAlarmsOutlined";
import { default as AppsOutlinedIcon } from "@mui/icons-material/AppsOutlined";
import { default as ChevronLeftIcon } from "@mui/icons-material/ChevronLeft";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as CloseOutlinedIcon } from "@mui/icons-material/CloseOutlined";
import {
  IconButton,
  Button,
  Modal,
  ModalDialog,
  Typography,
  ModalClose,
  Box,
  Stack,
  Divider,
  Tooltip,
  Drawer,
  DialogTitle,
  useTheme,
} from "@mui/joy";
import { DateTime } from "luxon";
import { NotFoundError } from "@cf/base/errors";
import { MarkdownFromServer } from "@cf/next/question-bank";
import { BugReportButton } from "@cf/next/user";
import { useBugReportDebugData } from "@cf/next/user";
import {
  ImageViewer,
  QuestionMultipleChoice,
  QuestionNavigation,
  useMediaQuery,
} from "@cf/react/components";
import { container } from "@cf/trpc/client";
import { TestError } from "../../components/test-error";
import { TestLoading } from "../../components/test-loading";
import { useTestProgress } from "../../hooks/use-test-progress";
import { useTestHotkeys } from "../../hooks/use-test-progress-hotkeys";
import { useTestProgressTime } from "../../hooks/use-test-progress-time";
import type { DrawingPoints } from "@cf/react/components";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

type Props = {
  testId: string;
  onTestFinished?: () => void;
};

export const TestExam = container<Props>(
  ({ testId, sx, onTestFinished, component = "section" }) => {
    useTestHotkeys({ testId });
    useTestProgressTime({ testId });

    const theme = useTheme();
    const test = useTestProgress((state) => state.tests[testId]);
    const goToQuestion = useTestProgress((s) => s.goToTestQuestion);
    const goToPreviousQuestion = useTestProgress((s) => s.goToPreviousQuestion);
    const goToNextQuestion = useTestProgress((s) => s.goToNextQuestion);
    const answerTestQuestion = useTestProgress((s) => s.answerTestQuestion);
    const finishTest = useTestProgress((s) => s.finishTest);
    const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [isFinishTestOpen, setIsFinishTestOpen] = useState(false);
    const [currentAnnex, setCurrentAnnex] = useState<string>();
    const [annexDrawings, setAnnexDrawings] = useState<DrawingPointsMap>({});

    if (!test) throw new NotFoundError(`Test with id ${testId} not found`);

    const question = test.questions[test.currentQuestionIndex];
    const timeLeft = test.durationInMs - test.timeSpentInMs;
    const status = test.mode === "exam" ? "in-progress" : "both";
    const currentQuestion = test.currentQuestionIndex + 1;
    const totalQuestions = test.questions.length;

    useBugReportDebugData("test-exam-current-question", () => question);
    useBugReportDebugData("test-exam-test", () => test);

    return (
      <Stack sx={sx} component={component}>
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.surface",
            borderBottom: "1px solid",
            borderColor: "divider",
            right: 0,
            width: "100%",
            boxSizing: "content-box",
            position: "fixed",
            height: (t) => t.spacing(6),

            h4: {
              fontSize: { xs: "0.8rem", md: "1rem" },
              textAlign: "center",
            },
          }}
        >
          <Tooltip title="Previous Question" variant="soft">
            <IconButton
              disabled={test.currentQuestionIndex === 0}
              children={<ChevronLeftIcon />}
              onClick={() => goToPreviousQuestion({ testId: test.id })}
            />
          </Tooltip>
          <Divider
            orientation="vertical"
            sx={{
              mx: { xs: 0.5, sm: 2 },
              display: { xs: "none", md: "block" },
            }}
          />
          <Typography level="h4" sx={{ display: { xs: "none", md: "block" } }}>
            {test.title}
          </Typography>
          <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
          <Typography level="h4">
            {`Question ${currentQuestion} / ${totalQuestions}`}
          </Typography>
          <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
          <AccessAlarmsOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />
          <Typography level="h4" sx={{ minWidth: "4.8em" }}>
            {DateTime.fromMillis(timeLeft).toFormat("hh:mm:ss")}
          </Typography>
          <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
          <BugReportButton />
          <Tooltip title="Question Navigation" variant="soft">
            <IconButton
              children={<AppsOutlinedIcon />}
              onClick={() => setIsNavigationOpen(true)}
            />
          </Tooltip>
          <Tooltip title="Finish Test" variant="soft">
            <IconButton
              children={<CloseOutlinedIcon />}
              onClick={() => setIsFinishTestOpen(true)}
            />
          </Tooltip>
          <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
          <Tooltip title="Next Question" variant="soft">
            <IconButton
              disabled={test.currentQuestionIndex === test.questions.length - 1}
              children={<ChevronRightIcon />}
              onClick={() => goToNextQuestion({ testId: test.id })}
            />
          </Tooltip>
        </Stack>
        <Box sx={{ height: (t) => t.spacing(6) }} />
        <QuestionMultipleChoice
          sx={{
            maxWidth: "md",
            mx: "auto",
            width: "100%",
            flex: 1,
            p: { xs: 1, md: 2 },
          }}
          question={<MarkdownFromServer children={question.question} />}
          disabled={question.selectedOptionId !== undefined}
          status={question.selectedOptionId ? "show-result" : "in-progress"}
          selectedOptionId={question.selectedOptionId}
          correctOptionId={question.correctOptionId}
          onOptionClicked={(optionId) =>
            answerTestQuestion({
              optionId,
              testId: test.id,
              questionId: question.questionId,
            })
          }
          options={question.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
          }))}
          annexesHref={question.annexes}
          onAnnexClicked={(annex) => setCurrentAnnex(annex)}
        />
        <ImageViewer
          open={currentAnnex !== undefined}
          onClose={() => setCurrentAnnex(undefined)}
          drawings={annexDrawings[currentAnnex ?? ""] ?? []}
          onDrawingsChanged={(newDrawings) =>
            setAnnexDrawings((oldDrawings) => ({
              ...oldDrawings,
              [currentAnnex ?? ""]: newDrawings,
            }))
          }
          onUndo={() =>
            setAnnexDrawings((old) => ({
              ...old,
              [currentAnnex ?? ""]: (old[currentAnnex ?? ""] ?? []).slice(
                0,
                -1,
              ),
            }))
          }
          onReset={() =>
            setAnnexDrawings((old) => ({
              ...old,
              [currentAnnex ?? ""]: [],
            }))
          }
          imgSrc={currentAnnex ?? ""}
        />
        <Drawer
          anchor="right"
          open={isNavigationOpen}
          onClose={() => setIsNavigationOpen(false)}
          sx={{ "--Drawer-horizontalSize": "460px" }}
        >
          <ModalClose />
          <DialogTitle>Question Navigation</DialogTitle>
          <Box sx={{ p: 2 }}>
            <QuestionNavigation
              sx={{ width: "100%", height: "100%" }}
              status={status}
              pageSize={isSmScreen ? 40 : 100}
              currentId={question.questionId}
              questions={test.questions.map((q) => ({
                id: q.questionId,
                selectedOption: q.selectedOptionId,
                correctOption: q.correctOptionId,
              }))}
              onQuestionClicked={(questionId) => {
                goToQuestion({ testId: test.id, questionId });
                setIsNavigationOpen(false);
              }}
            />
            <Button
              fullWidth
              sx={{ mt: 2 }}
              children="Finish"
              onClick={() => {
                finishTest({ testId: test.id });
                onTestFinished?.();
              }}
            />
          </Box>
        </Drawer>
        <Modal
          open={isFinishTestOpen}
          onClose={() => setIsFinishTestOpen(false)}
        >
          <ModalDialog>
            <ModalClose />
            <Typography level="h4" pt={2}>
              Are you sure you want to finish the test?
            </Typography>
            <Button
              fullWidth
              sx={{ mt: 2 }}
              children="Finish"
              color="danger"
              onClick={() => {
                finishTest({ testId: test.id });
                onTestFinished?.();
              }}
            />
          </ModalDialog>
        </Modal>
      </Stack>
    );
  },
);

TestExam.displayName = "TestExam";
TestExam.getData = async () => ({});
TestExam.useData = () => ({});
TestExam.ErrorFallback = TestError;
TestExam.LoadingFallback = TestLoading;
