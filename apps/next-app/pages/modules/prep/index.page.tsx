import { Divider, Typography } from "@mui/joy";
import {
  AppHead,
  LayoutModulePrep,
  ModulesOverview,
} from "@chair-flight/react/containers";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const PrepIndexPage: NextPage = () => (
  <LayoutModulePrep>
    <AppHead />
    <Typography level="h2">Question Bank</Typography>
    <Divider />
    <ModulesOverview module={"prep"} sx={{ my: 2 }} />
  </LayoutModulePrep>
);

export const getStaticProps: GetStaticProps = async () => {
  await preloadContentForStaticRender(await import("fs/promises"));
  const helper = await getTrpcHelper();

  await Promise.all([
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "atpl" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "a320" }),
    helper.questionBank.getNumberOfQuestions.fetch({ questionBank: "737" }),
  ]);

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default PrepIndexPage;
