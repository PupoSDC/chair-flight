import React, { StrictMode } from "react";
import { default as Head } from "next/head";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnalyticsProvider, AnalyticsPageLogger } from "@cf/next/analytics";
import { ThemeProvider } from "@cf/react/theme";
import { Toaster } from "@cf/react/ui";
import { trpc } from "@cf/trpc/client";
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
