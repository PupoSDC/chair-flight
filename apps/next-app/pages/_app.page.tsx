import React, { StrictMode } from "react";
import { default as Head } from "next/head";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppTransition, theme } from "@chair-flight/next/client";
import { Toaster } from "@chair-flight/react/components";
import type { AppProps } from "next/app";
import type { FunctionComponent } from "react";
import "@fontsource/public-sans";

if (typeof document === "undefined") {
  React.useLayoutEffect = React.useEffect;
}

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Head>
            <title>Welcome to chair-flight!</title>
          </Head>
          <CssVarsProvider defaultMode="system" theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
            <AppTransition />
            <Toaster />
          </CssVarsProvider>
        </Hydrate>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
