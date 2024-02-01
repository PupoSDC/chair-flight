import { default as CheckIcon } from "@mui/icons-material/Check";
import { Box, Grid, Sheet, Table, Typography } from "@mui/joy";
import { MarkdownClient } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import type {
  LearningObjectiveId,
  QuestionBankName,
} from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = {
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
};

type Params = {
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
};

type Data =
  AppRouterOutput["containers"]["learningObjectives"]["getLearningObjectiveOverview"];

export const LearningObjectiveOverview = container<Props, Params, Data>(
  ({ questionBank, learningObjectiveId, component = "section", sx }) => {
    const { learningObjective, courses } = LearningObjectiveOverview.useData({
      questionBank,
      learningObjectiveId,
    });

    return (
      <Sheet component={component} sx={sx}>
        <Grid container sx={{ m: { xs: 1, sm: 2 } }}>
          <Grid xs={12}>
            <Typography level="h4">{learningObjective.id}</Typography>
          </Grid>
          <Grid xs={12}>
            <MarkdownClient>{learningObjective.text}</MarkdownClient>
          </Grid>
          {learningObjective.source && (
            <Grid xs={12} lg={6}>
              <Typography level="h5">Source</Typography>
              <Box sx={{ color: "text.tertiary", fontSize: "sm" }}>
                <MarkdownClient>{learningObjective.source}</MarkdownClient>
              </Box>
            </Grid>
          )}
          <Grid xs={12} lg={6} sx={{ overflowX: "scroll" }}>
            <Typography level="h5">Courses</Typography>
            <Table sx={{ display: "block", overflowY: "auto" }}>
              <thead>
                <tr>
                  {courses.map((course) => (
                    <th style={{ fontSize: 10 }} key={course.id}>
                      {course.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {courses.map((course) => (
                    <td key={course.id}>
                      {learningObjective.courses.includes(course.id) && (
                        <CheckIcon />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </Table>
          </Grid>
        </Grid>
      </Sheet>
    );
  },
);

LearningObjectiveOverview.displayName = "LearningObjectiveOverview";

LearningObjectiveOverview.getData = async ({ helper, params }) => {
  const router = helper.containers.learningObjectives;
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");
  return await router.getLearningObjectiveOverview.fetch({
    questionBank,
    learningObjectiveId,
  });
};

LearningObjectiveOverview.useData = (params) => {
  const router = trpc.containers.learningObjectives;
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");
  return router.getLearningObjectiveOverview.useSuspenseQuery({
    questionBank,
    learningObjectiveId,
  })[0];
};
