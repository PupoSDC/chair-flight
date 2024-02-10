import { default as LinkIcon } from "@mui/icons-material/ChevronRightOutlined";
import { Divider, Link, Sheet, Stack, Typography } from "@mui/joy";
import {
  LayoutModule,
  LearningObjectiveOverview,
  LearningObjectiveQuestions,
  LearningObjectiveTree,
} from "@chair-flight/next/question-bank";
import { AppHead } from "@chair-flight/react/components";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { Breadcrumbs } from "@chair-flight/next/question-bank";
import type { NextPage } from "next";

type PageParams = {
  questionBank: QuestionBankName;
  learningObjectiveId: string;
};

type PageProps = {
  questionBank: QuestionBankName;
  learningObjectiveId: string;
};

const BIG_SCREEN =
  "@media screen and (min-height: 520px) and (min-width: 600px)";

export const Page: NextPage<PageProps> = ({
  questionBank,
  learningObjectiveId,
}) => {
  const loLink = `/modules/${questionBank}/learning-objectives`;
  const treeLink = `${loLink}/${learningObjectiveId}/tree`;
  const questionsLink = `${loLink}/${learningObjectiveId}/questions`;
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
      <Stack
        direction="row"
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "none",
          [BIG_SCREEN]: { display: "flex" },
        }}
      >
        <Stack sx={{ width: "50%", mr: 1, height: "100%" }}>
          <Link href={treeLink}>
            <Typography level="h3" sx={{ verticalAlign: "middle" }}>
              Related Learning Objectives
              <LinkIcon sx={{ verticalAlign: "middle" }} color="primary" />
            </Typography>
          </Link>
          <LearningObjectiveTree
            forceMode="mobile"
            questionBank={questionBank}
            learningObjectiveId={learningObjectiveId}
            sx={{ overflowY: "scroll", flex: 1 }}
          />
        </Stack>
        <Stack sx={{ width: "50%", ml: 1, height: "100%" }}>
          <Link href={questionsLink}>
            <Typography level="h3" sx={{ verticalAlign: "middle" }}>
              Questions
              <LinkIcon sx={{ verticalAlign: "middle" }} color="primary" />
            </Typography>
          </Link>
          <LearningObjectiveQuestions
            forceMode="mobile"
            questionBank={questionBank}
            learningObjectiveId={learningObjectiveId}
            sx={{ overflowY: "scroll", flex: 1 }}
          />
        </Stack>
      </Stack>
      <Sheet sx={{ [BIG_SCREEN]: { display: "none" }, p: 1 }}>
        <Link href={treeLink}>Related Learning Objectives</Link>
        <Divider sx={{ my: 1 }} />
        <Link href={questionsLink}>Questions</Link>
      </Sheet>
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ helper, params }) => {
    await Promise.all([
      LayoutModule.getData({ params, helper }),
      LearningObjectiveOverview.getData({ params, helper }),
      LearningObjectiveTree.getData({ params, helper }),
      LearningObjectiveQuestions.getData({ params, helper }),
    ]);
    return { props: params };
  },
);

export default Page;
