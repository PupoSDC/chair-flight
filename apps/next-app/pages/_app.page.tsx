import React, { StrictMode } from "react";
import { default as Head } from "next/head";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnalyticsProvider } from "@chair-flight/react/analytics";
import { Toaster } from "@chair-flight/react/components";
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
        <ReactQueryDevtools />
        <Head>
          <title>Welcome to chair-flight!</title>
        </Head>
        <CssVarsProvider defaultMode="system" theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
          <AppTransition />
          <Toaster />
        </CssVarsProvider>
      </AnalyticsProvider>
    </StrictMode>
  );
};

export default trpc.withTRPC(App);
