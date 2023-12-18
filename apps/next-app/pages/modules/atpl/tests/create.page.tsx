import { useRouter } from "next/router";
import {
  AppHead,
  LayoutModuleAtpl,
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
    <LayoutModuleAtpl fixedHeight>
      <AppHead />
      <TestMaker
        component="section"
        questionBank="atpl"
        sx={{ height: "100%" }}
        onSuccessfulTestCreation={(test) =>
          router.push(`/modules/atpl/tests/${test.id}/${test.mode}`)
        }
      />
    </LayoutModuleAtpl>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const questionBank = "atpl";
  await preloadContentForStaticRender(await import("fs/promises"));

  const helper = await getTrpcHelper();
  await Promise.all([
    helper.questionBank.getAllSubjects.fetch({
      questionBank,
    }),
  ]);

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default TestsCreatePage;
