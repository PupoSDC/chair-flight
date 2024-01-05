import { MissingPathParameter } from "@chair-flight/base/errors";
import {
  AppHead,
  LayoutModuleBank,
  TestsOverview,
} from "@chair-flight/react/containers";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type TestsIndexPageProps = {
  questionBank: QuestionBankName;
};

type TestsIndexPageParams = {
  questionBank: QuestionBankName;
};

const TestsIndexPage: NextPage<TestsIndexPageProps> = ({ questionBank }) => (
  <LayoutModuleBank questionBank={questionBank}>
    <AppHead />
    <TestsOverview
      component={"section"}
      sx={{ mx: "auto", maxWidth: "lg", width: "100%" }}
      questionBank={questionBank}
    />
  </LayoutModuleBank>
);

export const getStaticProps: GetStaticProps<
  TestsIndexPageProps,
  TestsIndexPageParams
> = async ({ params }) => {
  const questionBank = params?.questionBank;
  if (!questionBank) throw new MissingPathParameter("questionBank");
  return { props: { questionBank } };
};

export const getStaticPaths: GetStaticPaths<
  TestsIndexPageParams
> = async () => {
  const banks: QuestionBankName[] = ["b737", "a320", "atpl"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default TestsIndexPage;
