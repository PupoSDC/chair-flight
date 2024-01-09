import { useState, type FunctionComponent } from "react";
import { useRouter } from "next/router";
import { default as AccessAlarmsOutlinedIcon } from "@mui/icons-material/AccessAlarmsOutlined";
import { default as AppsOutlinedIcon } from "@mui/icons-material/AppsOutlined";
import { default as ChevronLeftIcon } from "@mui/icons-material/ChevronLeft";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as CloseOutlinedIcon } from "@mui/icons-material/CloseOutlined";
import { default as FormatListBulletedOutlinedIcon } from "@mui/icons-material/FormatListBulletedOutlined";
import { default as MenuOutlinedIcon } from "@mui/icons-material/MenuOutlined";
import { default as OpenInNewIcon } from "@mui/icons-material/OpenInNewOutlined";
import {
  useTheme,
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
  Link,
  DialogContent,
  iconButtonClasses,
} from "@mui/joy";
import { Duration } from "luxon";
import { NotFoundError } from "@chair-flight/base/errors";
import {
  ContainerWrapper,
  ImageViewer,
  MarkdownClient,
  QuestionMultipleChoice,
  QuestionNavigation,
  Ups,
  useMediaQuery,
} from "@chair-flight/react/components";
import { TestError } from "../components/test-error";
import { TestLoading } from "../components/test-loading";
import { useTestProgress } from "../hooks/use-test-progress";
import { useTestHotkeys } from "../hooks/use-test-progress-hotkeys";
import { useTestProgressTime } from "../hooks/use-test-progress-time";
import type { ContainerComponent } from "../../types";
import type { DrawingPoints } from "@chair-flight/react/components";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

type Props = {
  testId: string;
  onMenuClicked?: () => void;
};

const TestStudyComponent: FunctionComponent<Props> = ({
  testId,
  onMenuClicked,
}) => {
  useTestHotkeys({ testId });
  useTestProgressTime({ testId });

  const theme = useTheme();
  const router = useRouter();
  const test = useTestProgress((state) => state.tests[testId]);
  const goToQuestion = useTestProgress((s) => s.goToTestQuestion);
  const goToPreviousQuestion = useTestProgress((s) => s.goToPreviousQuestion);
  const goToNextQuestion = useTestProgress((s) => s.goToNextQuestion);
  const answerTestQuestion = useTestProgress((s) => s.answerTestQuestion);
  const finishTest = useTestProgress((s) => s.finishTest);
  const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [isFinishTestOpen, setIsFinishTestOpen] = useState(false);
  const [currentAnnex, setCurrentAnnex] = useState<string>();
  const [annexDrawings, setAnnexDrawings] = useState<DrawingPointsMap>({});

  if (!test) throw new NotFoundError(`Test with id ${testId} not found`);

  const question = test.questions[test.currentQuestionIndex];
  const status = test.mode === "exam" ? "in-progress" : "both";
  const currentQuestion = test.currentQuestionIndex + 1;
  const totalQuestions = test.questions.length;

  return (
    <Stack>
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: { xs: "space-around", sm: "center" },
          backgroundColor: "background.surface",
          borderBottom: "1px solid",
          borderColor: "divider",
          right: 0,
          width: "100%",
          boxSizing: "content-box",
          height: (t) => t.spacing(6),

          h4: {
            fontSize: { xs: "0.8rem", md: "1rem" },
            textAlign: "center",
          },

          [`& .${iconButtonClasses.root}`]: {
            p: 0,
            fontSize: { xs: "20px", md: "24px" },
            minWidth: { xs: "24px", md: "32px" },
            minHeight: { xs: "24px", md: "32px" },

            "& svg": {
              fontSize: "inherit",
            },
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
          sx={{ mx: { xs: 0.5, sm: 2 }, display: { xs: "none", md: "block" } }}
        />
        <Typography level="h4" sx={{ display: { xs: "none", md: "block" } }}>
          {test.title}
        </Typography>
        <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
        <Typography level="h4" sx={{ display: "flex" }}>
          <Box sx={{ display: { xs: "none", sm: "initial" } }} component="span">
            Question&nbsp;
          </Box>
          <Box component="span">{`${currentQuestion}/${totalQuestions}`}</Box>
        </Typography>
        <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
        <AccessAlarmsOutlinedIcon sx={{ fontSize: 20, mr: 0 }} />
        <Typography level="h4" sx={{ minWidth: "4.8em" }}>
          {Duration.fromMillis(test.timeSpentInMs).toFormat("hh:mm:ss")}
        </Typography>
        <Divider orientation="vertical" sx={{ mx: { xs: 0.5, sm: 2 } }} />
        {onMenuClicked && (
          <Tooltip
            title="Open Menu"
            variant="soft"
            sx={{ display: { sm: "none" } }}
          >
            <IconButton
              children={<MenuOutlinedIcon />}
              onClick={() => onMenuClicked?.()}
            />
          </Tooltip>
        )}
        <Tooltip title="Explanation & Meta" variant="soft">
          <IconButton
            children={<FormatListBulletedOutlinedIcon />}
            onClick={() => setIsMetaOpen(true)}
          />
        </Tooltip>
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
      <QuestionMultipleChoice
        sx={{
          maxWidth: "md",
          mx: "auto",
          width: "100%",
          flex: 1,
          p: { xs: 1, md: 2 },
        }}
        question={question.question}
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
          optionId: opt.id,
          text: opt.text,
        }))}
        annexes={question.annexes}
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
            [currentAnnex ?? ""]: (old[currentAnnex ?? ""] ?? []).slice(0, -1),
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
              router.push(`../${test.id}/review`);
            }}
          />
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={isMetaOpen}
        onClose={() => setIsMetaOpen(false)}
        sx={{ "--Drawer-horizontalSize": "640px" }}
      >
        <ModalClose />
        <DialogTitle>Question Meta</DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Button
            component={Link}
            variant="outlined"
            target="_blank"
            startDecorator={<OpenInNewIcon />}
            href={`../../questions/${question.templateId}?variant=${question.variantId}`}
            children="Explore Question"
          />
          <Divider sx={{ my: 2 }}>Explanation</Divider>
          {question.explanation ? (
            <MarkdownClient children={question.explanation} />
          ) : (
            <Ups message="No explanation is available" />
          )}
        </DialogContent>
      </Drawer>
      <Modal open={isFinishTestOpen} onClose={() => setIsFinishTestOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" pt={2}>
            Are you sure you want to finish the test?
          </Typography>
          <Button
            fullWidth
            sx={{ mt: 2 }}
            variant="outlined"
            children="Exit without finishing"
            color="warning"
            onClick={() => {
              router.push(`../`);
            }}
          />
          <Button
            fullWidth
            children="Finish"
            color="danger"
            onClick={() => {
              finishTest({ testId: test.id });
              router.push(`../${test.id}/review`);
            }}
          />
        </ModalDialog>
      </Modal>
    </Stack>
  );
};

export const TestStudy: ContainerComponent<Props> = (props) => (
  <ContainerWrapper
    noSsr
    ErrorFallbackComponent={TestError}
    LoadingFallbackComponent={TestLoading}
  >
    <TestStudyComponent {...props} />
  </ContainerWrapper>
);

TestStudy.getData = async () => ({});
TestStudy.useData = () => ({});
