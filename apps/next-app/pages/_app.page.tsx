import React, { StrictMode } from "react";
import { default as Head } from "next/head";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnalyticsProvider } from "@chair-flight/react/analytics";
import { ThemeProvider } from "@chair-flight/react/components";
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
        <ReactQueryDevtools position="bottom" />
        <Head>
          <title>Welcome to chair-flight!</title>
        </Head>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </AnalyticsProvider>
    </StrictMode>
  );
};

export default trpc.withTRPC(App);
