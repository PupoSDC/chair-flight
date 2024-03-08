"use client";

import { useState } from "react";
import { NoSsr } from "@mui/base";
import { MarkdownFromServer } from "@cf/next-old/question-bank";
import { ImageViewer, QuestionMultipleChoice } from "@cf/react/ui";
import { useTestProgress } from "../../hooks/use-test-progress";
import type { TestId } from "@cf/core/tests";
import type { DrawingPoints, QuestionMultipleChoiceProps } from "@cf/react/ui";
import type { FunctionComponent } from "react";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

type TestQuestionProps = {
  testId: TestId;
  component?: QuestionMultipleChoiceProps["component"];
  sx?: QuestionMultipleChoiceProps["sx"];
};

const TestQuestionComponent: FunctionComponent<TestQuestionProps> = ({
  testId,
  component = "div",
  sx,
}) => {
  const [currentAnnex, setCurrentAnnex] = useState<string>();
  const [annexDrawings, setAnnexDrawings] = useState<DrawingPointsMap>({});
  const answerTestQuestion = useTestProgress((s) => s.answerTestQuestion);
  const question = useTestProgress((s) => s.getCurrentQuestion({ testId }));
  const questionId = question.questionId;
  const mode = useTestProgress((s) => s.getTest({ testId }).mode);
  const showAnswer = mode === "study" && !!question.selectedOptionId;

  return (
    <>
      <QuestionMultipleChoice
        sx={{
          maxWidth: "md",
          mx: "auto",
          width: "100%",
          flex: 1,
          p: { xs: 1, md: 2 },
          ...sx,
        }}
        component={component}
        question={<MarkdownFromServer children={question.question} />}
        disabled={showAnswer}
        status={showAnswer ? "show-result" : "in-progress"}
        selectedOptionId={question.selectedOptionId}
        correctOptionId={question.correctOptionId}
        onOptionClicked={(optionId) =>
          answerTestQuestion({
            testId,
            questionId,
            optionId,
          })
        }
        options={question.options.map((opt) => ({
          id: opt.id,
          text: <MarkdownFromServer compressed children={opt.text} />,
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
    </>
  );
};

const TestQuestionFallback: FunctionComponent<TestQuestionProps> = ({
  component,
  sx,
}) => <QuestionMultipleChoice loading component={component} sx={sx} />;

export const TestQuestion: FunctionComponent<TestQuestionProps> = (props) => (
  <NoSsr
    fallback={<TestQuestionFallback {...props} />}
    children={<TestQuestionComponent {...props} />}
  />
);
