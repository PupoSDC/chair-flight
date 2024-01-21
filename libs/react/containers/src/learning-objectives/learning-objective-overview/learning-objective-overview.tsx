import { default as CheckIcon } from "@mui/icons-material/Check";
import { Box, Grid, Sheet, Table, Typography } from "@mui/joy";
import { MarkdownClient } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import type {
  LearningObjectiveId,
  QuestionBankCourse,
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
  courses: QuestionBankCourse[];
};

export const LearningObjectiveOverview = container<Props, Params, Data>(
  ({ questionBank, learningObjectiveId, component = "section", sx }) => {
    const { learningObjective, courses } = LearningObjectiveOverview.useData({ 
      questionBank, 
      learningObjectiveId 
    });

    return (
      <Sheet component={component} sx={sx}>
        <Grid container sx={{ m: 2 }}>
          <Grid xs={12} md={6}>
            <Typography level="h5">{learningObjective.id}</Typography>
            <MarkdownClient>{learningObjective.text}</MarkdownClient>
            {learningObjective.source && (
              <>
                <Typography level="body-sm">source: </Typography>
                <Box sx={{ color: "text.tertiary", fontSize: "sm" }}>
                  <MarkdownClient>{learningObjective.source}</MarkdownClient>
                </Box>
              </>
            )}
          </Grid>
          <Grid xs={12} md={6} sx={{ overflowX: "scroll" }}>
            <Table
              sx={{
                width: "auto",
                marginLeft: { md: "auto" },
              }}
            >
              <thead>
                <tr>
                  {courses.map((course) => (
                    <th
                      key={course.id}
                      children={course.text}
                      style={{
                        fontSize: 10,
                        width: 14 + course.text.length * 6,
                      }}
                    />
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

LearningObjectiveOverview.getData = async ({ params, helper }) => {
  const qb = helper.questionBank;
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");

  const [
    { learningObjective },
    { courses }
  ] = await Promise.all([
    qb.getLearningObjective.fetch({ questionBank, learningObjectiveId }),
    qb.getAllCourses.fetch({ questionBank })
  ])
  return { learningObjective, courses };
};

LearningObjectiveOverview.useData = (params) => {
  const qb = trpc.questionBank;
  const questionBank = getRequiredParam(params, "questionBank");
  const learningObjectiveId = getRequiredParam(params, "learningObjectiveId");

  const [{ learningObjective }] =qb.getLearningObjective.useSuspenseQuery({
    questionBank,
    learningObjectiveId,
  });
  const [{ courses }] =qb.getAllCourses.useSuspenseQuery({
    questionBank,
  });

  return { learningObjective, courses };
};
