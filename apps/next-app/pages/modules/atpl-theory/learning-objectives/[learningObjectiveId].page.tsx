import { default as CheckIcon } from "@mui/icons-material/Check";
import { Box, Grid, Sheet, Table, Typography } from "@mui/joy";
import { CourseNames } from "@chair-flight/core/app";
import { AppLayout, Header } from "@chair-flight/react/components";
import { AppHead, AppHeaderMenu } from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { CourseName } from "@chair-flight/base/types";
import type { NextPage } from "next";

type LearningObjectivePageParams = {
  learningObjectiveId: string;
};

type LearningObjectivePageProps = {
  learningObjectiveId: string;
};

export const LearningObjectivePage: NextPage<LearningObjectivePageProps> = ({
  learningObjectiveId,
}) => {
  const [{ learningObjective }] =
    trpc.questionBankAtpl.getLearningObjective.useSuspenseQuery({
      learningObjectiveId,
    });

  return (
    <>
      <AppHead />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main>
        <Box sx={{ mb: 1 }}>
          <Sheet sx={{ p: 2, mx: { xs: 0, md: 1 } }}>
            <Grid container>
              <Grid xs={12} md={6}>
                <Typography>{learningObjective.id}</Typography>
                <Typography level="body-sm">
                  {learningObjective.text}
                </Typography>
                <Typography level="body-sm">
                  source: {learningObjective.text}
                </Typography>
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
        </Box>
        {/** 
        <QuestionPreviewList
          sx={{ overflow: "initial" }}
        />*/}
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps = ssrHandler<
  LearningObjectivePageProps,
  LearningObjectivePageParams
>(async ({ helper, params }) => {
  const { learningObjectiveId } = params;

  await helper.questionBankAtpl.getLearningObjective.prefetch({
    learningObjectiveId,
  });

  return {
    props: {
      learningObjectiveId,
    },
  };
});

export default LearningObjectivePage;
