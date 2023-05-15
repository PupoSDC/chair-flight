import { default as CheckIcon } from "@mui/icons-material/Check";
import { Box, Grid, Sheet, Table, Typography } from "@mui/joy";
import { CourseNames, getQuestionPreview } from "@chair-flight/core/app";
import {
  AppHead,
  AppHeaderMenu,
  QuestionPreviewList,
} from "@chair-flight/next/client";
import { ssrHandler } from "@chair-flight/next/server";
import { AppLayout, Header } from "@chair-flight/react/components";
import type { CourseName, LearningObjective } from "@chair-flight/base/types";
import type { QuestionPreview } from "@chair-flight/core/app";
import type { FunctionComponent } from "react";

type LearningObjectivePageProps = {
  learningObjective: LearningObjective;
  questions: QuestionPreview[];
};

export const LearningObjectivePage: FunctionComponent<
  LearningObjectivePageProps
> = ({ questions, learningObjective }) => {
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
                <Typography level="body2">{learningObjective.text}</Typography>
                <Typography level="body3">
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
                            courseName as CourseName
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
        <QuestionPreviewList
          questions={questions}
          sx={{ overflow: "initial" }}
        />
      </AppLayout.Main>
    </>
  );
};

export const getServerSideProps = ssrHandler<LearningObjectivePageProps>(
  async ({ context, questionBank }) => {
    const learningObjectiveId = context.params?.[
      "learningObjectiveId"
    ] as string;
    const learningObjective = await questionBank.getLearningObjective(
      learningObjectiveId
    );
    const questionTemplates = await questionBank.getQuestionTemplates(
      learningObjective.questions
    );
    const questions = questionTemplates.map<QuestionPreview>((template) => {
      const allVariants = Object.values(template.variants);
      const variant = allVariants[0];
      const text = getQuestionPreview(template, variant.id);
      const externalIds = [
        ...new Set(allVariants.flatMap((v) => v.externalIds)),
      ];
      return {
        questionId: template.id,
        variantId: variant.id,
        text: text,
        learningObjectives: template.learningObjectives,
        externalIds: externalIds,
        numberOfVariants: allVariants.length,
      };
    });
    return {
      props: {
        learningObjective,
        questions,
      },
    };
  }
);

export default LearningObjectivePage;
