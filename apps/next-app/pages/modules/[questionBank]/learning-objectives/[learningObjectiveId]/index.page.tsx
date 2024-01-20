import { Link, Sheet } from "@mui/joy";
import { AppHead } from "@chair-flight/react/components";
import {
  LayoutModule,
  LearningObjectiveOverview,
  LearningObjectiveQuestions,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type PageParams = {
  questionBank: QuestionBankName;
  learningObjectiveId: string;
};

type PageProps = {
  questionBank: QuestionBankName;
  learningObjectiveId: string;
};

export const Page: NextPage<PageProps> = ({
  questionBank,
  learningObjectiveId,
}) => {
  const loLink = `/modules/${questionBank}/learning-objectives`;
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Learning Objectives", loLink],
    learningObjectiveId,
  ] as Breadcrumbs;

  return (
    <LayoutModule fixedHeight questionBank={questionBank} breadcrumbs={crumbs}>
      <AppHead />
      <LearningObjectiveOverview
        sx={{ mb: { xs: 1, sm: 2 } }}
        questionBank={questionBank}
        learningObjectiveId={learningObjectiveId}
      />
      <LearningObjectiveQuestions
        questionBank={questionBank}
        learningObjectiveId={learningObjectiveId}
        sx={{
          flex: 1,
          overflowY: "scroll",
          display: "none",

          "@media screen and (min-height: 520px) and (min-width: 600px)": {
            display: "block",
          },
        }}
      />
      <Sheet
        sx={{
          p: 2,

          "@media screen and (min-height: 520px) and (min-width: 600px)": {
            display: "none",
          },
        }}
      >
        <Link href={`${loLink}/${learningObjectiveId}/questions`}>
          Questions
        </Link>
      </Sheet>
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ helper, params }) => {
    await Promise.all([
      LayoutModule.getData({ params, helper }),
      LearningObjectiveOverview.getData({ params, helper }),
      LearningObjectiveQuestions.getData({ params, helper }),
    ]);
    return { props: params };
  },
);

export default Page;
