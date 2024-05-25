import { Fragment, type FunctionComponent } from "react";
import {
  Box,
  Divider,
  Link,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  Skeleton,
  Typography,
} from "@mui/joy";
import { Markdown } from "@cf/react/markdown";
import { Ups } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";

export const QuestionLearningObjectives: FunctionComponent<{
  questionId: string;
}> = ({ questionId }) => {
  const loQuery = trpc.questionBank.questions.getLearningObjectives.useQuery(
    { id: questionId },
    { keepPreviousData: true },
  );

  if (loQuery.error) {
    return <Ups message="Failed to load Learning Objectives" color="danger" />;
  }

  if (loQuery.isLoading) {
    return <Skeleton />;
  }

  return (
    <List>
      {loQuery.data.learningObjectives.map((result, i, arr) => (
        <Fragment key={result.id}>
          <ListItem sx={{ px: 0 }}>
            <ListItemContent>
              <Link href={result.href}>
                <Typography>{result.id}</Typography>
              </Link>
              <Typography level="body-xs" sx={{ fontSize: 10 }}>
                {result.courses.map((c) => c.text).join(", ")}
              </Typography>
              <Typography level="body-xs" sx={{ fontSize: 10 }}>
                Number of Questions {result.numberOfQuestions}
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  fontSize: "sm",
                  overflow: "hidden",
                }}
              >
                <Markdown compressed>{result.title}</Markdown>
                {result.source && (
                  <>
                    <Divider sx={{ width: "50%", my: 0.5 }} />
                    <Typography level="body-xs">source: </Typography>
                    <Markdown
                      compressed
                      sx={{ color: "text.tertiary", fontSize: "xs" }}
                    >
                      {result.source}
                    </Markdown>
                  </>
                )}
              </Box>
            </ListItemContent>
          </ListItem>
          {i < arr.length - 1 && <ListDivider inset={"gutter"} />}
        </Fragment>
      ))}
    </List>
  );
};
