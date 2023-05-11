import { ReduxProvider } from "@chair-flight/core/redux";
import {
  AlphaWarning,
  AppHead,
  AppHeaderMenu,
} from "@chair-flight/next/client";
import { staticHandler } from "@chair-flight/next/server";
import { AppLayout, Header } from "@chair-flight/react/components";
import { PreviewTests } from "./components/tests-overview";
import type { NextPage } from "next";

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

export const getStaticProps = staticHandler(() => {
  return { props: {} };
});

export default TestPage;
