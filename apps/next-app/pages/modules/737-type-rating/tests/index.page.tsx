import { useRouter } from "next/router";
import {
  AppHead,
  LayoutModule737,
  TestMaker,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const TestsIndexPage: NextPage = () => {
  const router = useRouter();

  return (
    <LayoutModule737 fixedHeight>
      <AppHead />
      <TestMaker
        component="section"
        createTest={trpc.questionBank737.createTest}
        getAllSubjects={trpc.questionBank737.getAllSubjects}
        testPersistenceKey="cf-test-maker-737"
        sx={{ height: "100%" }}
        onSuccessfulTestCreation={(test) =>
          router.push(`./${test.id}/${test.mode}`)
        }
      />
    </LayoutModule737>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const helper = await getTrpcHelper();
  await Promise.all([helper.questionBank737.getAllSubjects.fetch()]);

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default TestsIndexPage;
