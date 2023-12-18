import { useRouter } from "next/router";
import {
  AppHead,
  LayoutModule737,
  TestMaker,
} from "@chair-flight/react/containers";
import {
  getTrpcHelper,
  preloadContentForStaticRender,
} from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const TestsCreatePage: NextPage = () => {
  const router = useRouter();

  return (
    <LayoutModule737 fixedHeight>
      <AppHead />
      <TestMaker
        component="section"
        questionBank="737"
        sx={{ height: "100%" }}
        onSuccessfulTestCreation={(test) => {
          router.push(`/modules/737/tests/${test.id}/${test.mode}`);
        }}
      />
    </LayoutModule737>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const questionBank = "737";
  await preloadContentForStaticRender(await import("fs/promises"));
  const helper = await getTrpcHelper();
  await Promise.all([
    helper.questionBank.getAllSubjects.fetch({ questionBank }),
  ]);

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default TestsCreatePage;
