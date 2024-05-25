import { type FunctionComponent } from "react";
import { Link, Skeleton, Typography } from "@mui/joy";
import { Ups } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";

export const QuestionExternalReferences: FunctionComponent<{
  questionId: string;
}> = ({ questionId }) => {
  const externalRefsQuery =
    trpc.questionBank.questions.getExternalReferences.useQuery(
      { id: questionId },
      { keepPreviousData: true },
    );

  if (externalRefsQuery.error) {
    return <Ups message="Failed to load Learning Objectives" color="danger" />;
  }

  if (externalRefsQuery.isLoading) {
    return <Skeleton />;
  }

  return (
    <Typography>
      {externalRefsQuery.data.externalReferences.map((result) => (
        <Link key={result.id} href={"/"} disabled sx={{ mr: 2 }}>
          {result.id}
        </Link>
      ))}
    </Typography>
  );
};
