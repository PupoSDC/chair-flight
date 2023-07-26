import { ReduxProvider } from "@chair-flight/core/redux";
import { AppLayout, Header } from "@chair-flight/react/components";
import {
  AlphaWarning,
  AppHead,
  AppHeaderMenu,
} from "@chair-flight/react/containers";
import { PreviewTests } from "./components/tests-overview";
import type { GetStaticProps, NextPage } from "next";

const TestPage: NextPage = () => (
  <>
    <AppHead />
    <Header>
      <AppHeaderMenu />
    </Header>
    <AppLayout.Main sx={{ maxWidth: (t) => t.breakpoints.values.lg }}>
      <ReduxProvider loading={"loading..."}>
        <AlphaWarning />
        <PreviewTests />
      </ReduxProvider>
    </AppLayout.Main>
  </>
);

export const getStaticProps: GetStaticProps = () => {
  return { props: {} };
};

export default TestPage;
