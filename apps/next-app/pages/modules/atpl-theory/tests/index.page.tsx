import { useRouter } from "next/router";
import { HEADER_HEIGHT, Header } from "@chair-flight/react/components";
import {
  AppHead,
  SidebarAtpl,
  TestMaker,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { getTrpcHelper } from "@chair-flight/trpc/server";
import type { GetStaticProps, NextPage } from "next";

const HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

const TestsIndexPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <AppHead />
      <Header borderStyle="outlined" />
      <SidebarAtpl />
      <TestMaker
        component="main"
        createTest={trpc.questionBankAtpl.createTest}
        getAllSubjects={trpc.questionBankAtpl.getAllSubjects}
        testPersistenceKey="cf-test-maker-atpl"
        sx={(t) => ({
          height: HEIGHT,
          width: `var(${t.dimensions.vars.sidebarRemainingWidth})`,
          marginLeft: "auto",
          marginRight: 0,
          p: { xs: 0.5, md: 2 },
          transition: "margin-left 0.25s, width 0.25s",
        })}
        onSuccessfulTestCreation={(test) =>
          router.push(`./${test.id}/${test.mode}`)
        }
      />
    </>
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
