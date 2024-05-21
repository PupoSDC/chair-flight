import React, { StrictMode } from "react";
import { default as dynamic } from "next/dynamic";
import { default as Head } from "next/head";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@cf/react/theme";
import { Toaster } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";
import { AnalyticsPageLogger } from "./_components/analytics-page-logger";
import { AnalyticsProvider } from "./_providers/analytics-provider";
import type { AppProps } from "next/app";
import type { FunctionComponent } from "react";
import "@fontsource/public-sans";

const UserBugReport = dynamic(
  () => import("./_components/app-bug-report").then((mod) => mod.AppBugReport),
  { ssr: false },
);

if (typeof document === "undefined") {
  React.useLayoutEffect = React.useEffect;
}

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <StrictMode>
      <AnalyticsProvider>
        <ThemeProvider>
          <AnalyticsPageLogger />
          <ReactQueryDevtools position="bottom-right" />
          <Head>
            <title>Welcome to chair-flight!</title>
          </Head>
          <Component {...pageProps} />
          <Toaster />
          <UserBugReport />
        </ThemeProvider>
      </AnalyticsProvider>
    </StrictMode>
  );
};

export default trpc.withTRPC(App);
