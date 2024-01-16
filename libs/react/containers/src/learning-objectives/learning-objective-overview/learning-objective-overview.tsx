import { default as CheckIcon } from "@mui/icons-material/Check";
import { Box, Grid, Sheet, Table, Typography } from "@mui/joy";
import { CourseNames } from "@chair-flight/core/app";
import { MarkdownClient } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import type {
  CourseName,
  LearningObjectiveId,
  QuestionBankLearningObjective,
  QuestionBankName,
} from "@chair-flight/base/types";

type Props = {
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
};

type Params = {
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
};

type Data = {
  learningObjective: QuestionBankLearningObjective;
};

export const LearningObjectiveOverview = container<Props, Params, Data>(
  ({ questionBank, learningObjectiveId, component = "section", sx }) => {
    const params = { questionBank, learningObjectiveId };
    const { learningObjective } = LearningObjectiveOverview.useData(params);

    return (
      <Sheet component={component} sx={sx}>
        <Grid container>
          <Grid xs={12} md={6}>
            <Typography>{learningObjective.id}</Typography>
            <MarkdownClient>{learningObjective.text}</MarkdownClient>
            <Typography level="body-sm">source: </Typography>
            <Box sx={{ color: "text.tertiary", fontSize: "sm" }}>
              <MarkdownClient>{learningObjective.source}</MarkdownClient>
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Table
              sx={{
                width: "auto",
                marginLeft: { md: "auto" },
              }}
            >
              <thead>
                <tr>
                  {Object.values(CourseNames).map((courseName) => (
                    <th
                      className="course-name"
                      key={courseName}
                      children={courseName}
                      style={{
                        fontSize: 10,
                        width: 14 + courseName.length * 6,
                      }}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.keys(CourseNames).map((courseName) => (
                    <td key={courseName} className="course-name">
                      {learningObjective.courses.includes(
                        courseName as CourseName,
                      ) && <CheckIcon />}
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

LearningObjectiveOverview.getData = async ({ params, helper }) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");

  return await helper.questionBank.getLearningObjective.fetch({
    questionBank,
    learningObjectiveId,
  });
};

LearningObjectiveOverview.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");

  return trpc.questionBank.getLearningObjective.useSuspenseQuery({
    questionBank,
    learningObjectiveId,
  })[0];
};
