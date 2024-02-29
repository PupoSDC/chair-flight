import { useState } from "react";
import { MarkdownFromServer } from "@cf/next-old/question-bank";
import { ImageViewer, QuestionMultipleChoice } from "@cf/react/ui";
import { container } from "@cf/trpc/client";
import { TestError } from "../../components/test-error";
import { useTestProgress } from "../../hooks/use-test-progress";
import type { TestId } from "@cf/core/tests";
import type { DrawingPoints } from "@cf/react/ui";

type DrawingPointsMap = Record<string, DrawingPoints[]>;

type Props = {
  testId: TestId;
  mode: "study" | "exam";
  noSsr: true;
};

export const TestQuestion = container<Props>(
  ({ testId, mode, component = "div", sx }) => {
    const [currentAnnex, setCurrentAnnex] = useState<string>();
    const [annexDrawings, setAnnexDrawings] = useState<DrawingPointsMap>({});
    const answerTestQuestion = useTestProgress((s) => s.answerTestQuestion);
    const test = useTestProgress((state) => state.tests[testId]);
    const question = test.questions[test.currentQuestionIndex];
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
              optionId,
              testId: test.id,
              questionId: question.questionId,
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
      </>
    );
  },
);

TestQuestion.displayName = "TestQuestion";
TestQuestion.getData = async () => ({});
TestQuestion.useData = () => ({});
TestQuestion.ErrorFallback = TestError;
TestQuestion.LoadingFallback = () => <QuestionMultipleChoice loading />;
