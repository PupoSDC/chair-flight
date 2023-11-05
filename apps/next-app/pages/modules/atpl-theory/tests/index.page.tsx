import { useRouter } from "next/router";
import {
  AppHead,
  LayoutModuleAtpl,
  TestMaker,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const TestsIndexPage: NextPage = () => {
  const router = useRouter();

  return (
    <LayoutModuleAtpl fixedHeight>
      <AppHead />
      <TestMaker
        component="section"
        createTest={trpc.questionBankAtpl.createTest}
        getAllSubjects={trpc.questionBankAtpl.getAllSubjects}
        testPersistenceKey="cf-test-maker-atpl"
        sx={{ height: "100%" }}
        onSuccessfulTestCreation={(test) =>
          router.push(`/modules/atpl-theory/tests/${test.id}/${test.mode}`)
        }
      />
    </LayoutModuleAtpl>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const helper = await getTrpcHelper();
  await Promise.all([helper.questionBankAtpl.getAllSubjects.fetch()]);

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};

export default TestsIndexPage;
