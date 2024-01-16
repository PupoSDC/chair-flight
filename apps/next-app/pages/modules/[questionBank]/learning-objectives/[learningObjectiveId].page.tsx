import { AppHead } from "@chair-flight/react/components";
import {
  LayoutModule,
  LearningObjectiveOverview,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { NextPage } from "next";

type PageParams = {
  questionBank: QuestionBankName;
  learningObjectiveId: string;
};

type PageProps = {
  questionBank: QuestionBankName;
  learningObjectiveId: string;
};

export const Page: NextPage<PageProps> = (props) => (
  <LayoutModule {...props}>
    <AppHead />
    <LearningObjectiveOverview sx={{ p: 2 }} {...props} />
  </LayoutModule>
);

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ helper, params }) => {
    await Promise.all([
      LayoutModule.getData({ params, helper }),
      LearningObjectiveOverview.getData({ params, helper }),
    ]);
    return { props: params };
  },
);

export default Page;
