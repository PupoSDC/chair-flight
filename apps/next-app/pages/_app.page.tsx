import React, { StrictMode } from "react";
import { default as dynamic } from "next/dynamic";
import { default as Head } from "next/head";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnalyticsProvider } from "@chair-flight/react/analytics";
import { StopResizeAnimation } from "@chair-flight/react/components";
import { theme } from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import type { DefaultColorScheme } from "@mui/joy/styles/types";
import type { AppProps } from "next/app";
import type { FunctionComponent } from "react";
import "@fontsource/public-sans";

if (typeof document === "undefined") {
  React.useLayoutEffect = React.useEffect;
}

const DynamicToaster = dynamic(
  () => import("@chair-flight/react/components").then((m) => m.Toaster),
  { loading: () => null, ssr: false },
);

const DynamicAppTransition = dynamic(
  () => import("@chair-flight/react/containers").then((m) => m.AppTransition),
  { loading: () => null, ssr: false },
);

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <StrictMode>
      <AnalyticsProvider>
        <ReactQueryDevtools position="bottom-right" />
        <Head>
          <title>Welcome to chair-flight!</title>
        </Head>
        <CssVarsProvider
          defaultMode="light"
          defaultColorScheme={"lightBlue" as DefaultColorScheme}
          theme={theme}
        >
          <CssBaseline />
          <StopResizeAnimation />
          <Component {...pageProps} />
          <DynamicToaster />
          <DynamicAppTransition />
        </CssVarsProvider>
      </AnalyticsProvider>
    </StrictMode>
  );
};

export default trpc.withTRPC(App);
