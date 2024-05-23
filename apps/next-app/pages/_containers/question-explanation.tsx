import { Skeleton, Typography } from "@mui/joy";
import { Markdown } from "@cf/react/markdown";
import { Ups } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";
import type { FunctionComponent } from "react";

export const QuestionExplanation: FunctionComponent<{
  questionId: string;
}> = ({ questionId }) => {
  const questionQuery = trpc.questionBank.questions.getExplanation.useQuery(
    { id: questionId },
    { keepPreviousData: true },
  );

  if (questionQuery.error) {
    return <Ups message="Failed to load explanation" color="danger" />;
  }

  if (questionQuery.isLoading) {
    return <Skeleton />;
  }

  if (!questionQuery.data.explanation) {
    return (
      <Ups message="Explanation missing">
        <Typography>
          Chair Flight is a community build project.
          <br />
          Help ups improve by contributing with an explanation.
        </Typography>
      </Ups>
    );
  }

  return <Markdown>{questionQuery.data.explanation}</Markdown>;
};
