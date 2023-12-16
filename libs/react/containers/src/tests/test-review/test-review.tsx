import { Box, CircularProgress, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import { TestQuestionResult } from "@chair-flight/react/components";
import { useTestProgress } from "../use-test-progress";
import type { FunctionComponent } from "react";

export type TestReviewProps = {
  testId: string;
};

export const TestReview: FunctionComponent<TestReviewProps> = ({ testId }) => {
  const test = useTestProgress((s) => s.tests[testId]);
  const totalQuestions = test.questions.length;
  const correctQuestions = test.questions.reduce(
    (acc, q) => acc + (q.correctOptionId === q.selectedOptionId ? 1 : 0),
    0,
  );
  const grade = Math.round((correctQuestions / totalQuestions) * 100);
  const mainColor = grade >= 75 ? "success" : "danger";
  const startTimeInEnglish =
    test.startedAtEpochMs &&
    DateTime.fromMillis(test.startedAtEpochMs).toFormat("DDD");
  const timeSpent =
    test.startedAtEpochMs &&
    DateTime.fromMillis(test.startedAtEpochMs).toFormat("HH:mm:ss");

  return (
    <>
      <Box
        sx={{
          height: "172px",
          width: "100%",
          bgcolor: `${mainColor}.softBg`,
        }}
      >
        <Box
          sx={{
            maxWidth: 1300,
            height: "100%",
            p: 2,
            mx: "auto",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Typography level="h4" component="h1">
              Test results
            </Typography>
            <Typography level="body-md" fontWeight={900}>
              {[
                test.id,
                startTimeInEnglish,
                timeSpent && `Time Spent: ${timeSpent}`,
                `${correctQuestions}/${totalQuestions}`,
              ]
                .filter(Boolean)
                .join(" | ")}
            </Typography>
          </Box>
          <CircularProgress
            determinate
            value={grade}
            children={`${grade}%`}
            variant="outlined"
            color={mainColor}
            size="lg"
            sx={{
              "--CircularProgress-size": "120px",
              "--CircularProgress-progressThickness": "12px",
              "--CircularProgress-linecap": "butt",
              m: 2,
            }}
          />
        </Box>
      </Box>
      <Box component={"ul"} sx={{ maxWidth: 1300, px: 2, mx: "auto" }}>
        {test.questions.map((question, i, arr) => (
          <TestQuestionResult
            key={question.questionId}
            questionTemplateId={question.templateId}
            questionVariantId={question.variantId}
            sx={{ my: 1 }}
            title={`${i + 1}/${arr.length}`}
            question={question.question}
            correct={question.selectedOptionId === question.correctOptionId}
            correctOption={
              question.options.find((o) => o.id === question.correctOptionId)
                ?.text
            }
            selectedOption={
              question.options.find((o) => o.id === question.selectedOptionId)
                ?.text
            }
          />
        ))}
      </Box>
    </>
  );
};
