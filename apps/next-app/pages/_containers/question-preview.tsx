import { Skeleton, Typography } from "@mui/joy";
import { Markdown } from "@cf/react/markdown";
import { Ups } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";
import type { FunctionComponent } from "react";

export const QuestionPreview: FunctionComponent<{
  questionId: string;
}> = ({ questionId }) => {
  const questionQuery = trpc.questionBank.questions.getPreview.useQuery(
    { id: questionId },
    { keepPreviousData: true },
  );

  if (questionQuery.error) {
    return <Ups message="Failed to load preview" color="danger" />;
  }

  if (questionQuery.isLoading) {
    return <Skeleton />;
  }

  return <Markdown>{questionQuery.data.preview}</Markdown>;
};
