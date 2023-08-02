import { NoSsr } from "@mui/base";
import { AppLayout, Header } from "@chair-flight/react/components";
import {
  AlphaWarning,
  AppHead,
  AppHeaderMenu,
  TestsOverview,
} from "@chair-flight/react/containers";
import type { GetStaticProps, NextPage } from "next";

const TestPage: NextPage = () => (
  <>
    <AppHead />
    <Header>
      <AppHeaderMenu />
    </Header>
    <AppLayout.Main sx={{ maxWidth: (t) => t.breakpoints.values.lg }}>
      <AlphaWarning />
      <NoSsr fallback="Loading tests...">
        <TestsOverview />
      </NoSsr>
    </AppLayout.Main>
  </>
);

export const getStaticProps: GetStaticProps = () => {
  return { props: {} };
};

export default TestPage;
