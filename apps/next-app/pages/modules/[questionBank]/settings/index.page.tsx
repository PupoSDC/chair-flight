import { NoSsr } from "@mui/base";
import {
  AppHead,
  LayoutModuleBank,
  UserSettings,
} from "@chair-flight/react/containers";
import { preloadContentForStaticRender } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type SettingsPageProps = {
  questionBank: QuestionBankName;
};

type SettingsPageParams = {
  questionBank: QuestionBankName;
};

const SettingsPage: NextPage<SettingsPageProps> = ({ questionBank }) => (
  <LayoutModuleBank questionBank={questionBank} fixedHeight>
    <AppHead />
    <NoSsr>
      <UserSettings />
    </NoSsr>
  </LayoutModuleBank>
);

export const getStaticProps: GetStaticProps<
  SettingsPageProps,
  SettingsPageParams
> = async ({ params }) => {
  if (!params) throw new Error("Params must be defined. Check File name!");
  await preloadContentForStaticRender(await import("fs/promises"));
  const { questionBank } = params;

  return {
    props: {
      questionBank,
    },
  };
};

export const getStaticPaths: GetStaticPaths<SettingsPageParams> = async () => {
  const banks: QuestionBankName[] = ["b737", "a320", "atpl"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default SettingsPage;
