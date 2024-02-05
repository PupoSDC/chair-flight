import { AppHead } from "@chair-flight/react/components";
import {
  LayoutModule,
  LearningObjectiveQuestions,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
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
    ["Learning Objectives", `${loLink}`],
    [learningObjectiveId, `${loLink}/${learningObjectiveId}`],
    "Questions",
  ] as Breadcrumbs;

  return (
    <LayoutModule fixedHeight questionBank={questionBank} breadcrumbs={crumbs}>
      <AppHead />
      <LearningObjectiveQuestions
        questionBank={questionBank}
        learningObjectiveId={learningObjectiveId}
        sx={{ flex: 1, overflowY: "scroll" }}
      />
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ helper, params }) => {
    await Promise.all([
      LayoutModule.getData({ params, helper }),
      LearningObjectiveQuestions.getData({ params, helper }),
    ]);
    return { props: params };
  },
);

export default Page;
