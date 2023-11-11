import { NoSsr } from "@mui/base";
import { Skeleton } from "@mui/joy";
import { NotFoundError } from "@chair-flight/base/errors";
import {
  AppHead,
  LayoutModuleAtpl,
  TestStudy,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

type StudyPageProps = {
  testId: string;
};

export const StudyPage: NextPage<StudyPageProps> = ({ testId }) => (
  <LayoutModuleAtpl noPadding fixedHeight>
    <AppHead />
    <NoSsr fallback={<Skeleton height={"500px"} />}>
      <TestStudy testId={testId} />
    </NoSsr>
  </LayoutModuleAtpl>
);

export const getServerSideProps = ssrHandler<StudyPageProps>(
  async ({ context }) => {
    const testId = context.params?.["testId"];
    if (typeof testId !== "string") throw new NotFoundError();
    return { props: { testId } };
  },
);

export default StudyPage;
