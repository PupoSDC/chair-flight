import React, { StrictMode } from "react";
import { default as Head } from "next/head";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  AnalyticsProvider,
  AnalyticsPageLogger,
} from "@chair-flight/next/analytics";
import { Toaster } from "@chair-flight/react/components";
import { ThemeProvider } from "@chair-flight/react/theme";
import { trpc } from "@chair-flight/trpc/client";
import type { AppProps } from "next/app";
import type { FunctionComponent } from "react";
import "@fontsource/public-sans";

if (typeof document === "undefined") {
  React.useLayoutEffect = React.useEffect;
}

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <StrictMode>
      <AnalyticsProvider>
        <AnalyticsPageLogger />
        <ReactQueryDevtools position="bottom-right" />
        <Head>
          <title>Welcome to chair-flight!</title>
        </Head>
        <ThemeProvider>
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </AnalyticsProvider>
    </StrictMode>
  );
};

export default trpc.withTRPC(App);
