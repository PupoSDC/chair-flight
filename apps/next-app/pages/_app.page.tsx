import React, { StrictMode } from "react";
import { default as Head } from "next/head";
import { NoSsr } from "@mui/base";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnalyticsProvider } from "@chair-flight/react/analytics";
import { StopResizeAnimation, Toaster } from "@chair-flight/react/components";
import { AppTransition, theme } from "@chair-flight/react/containers";
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
        <ReactQueryDevtools position="bottom-right" />
        <Head>
          <title>Welcome to chair-flight!</title>
        </Head>
        <CssVarsProvider defaultMode="system" theme={theme}>
          <CssBaseline />
          <StopResizeAnimation />
          <Component {...pageProps} />
          <NoSsr>
            <AppTransition />
            <Toaster />
          </NoSsr>
        </CssVarsProvider>
      </AnalyticsProvider>
    </StrictMode>
  );
};

export default trpc.withTRPC(App);
