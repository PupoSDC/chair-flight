import React, { StrictMode } from "react";
import type { AppProps } from "next/app";
import type { FunctionComponent } from "react";
import { CustomGlobalStyles } from "./_global.styles";
import { PicoGlobalStyles } from "./_pico.styles";
import { default as Head } from "next/head";

if (typeof document === "undefined") {
  React.useLayoutEffect = React.useEffect;
}

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <StrictMode>
      <Head>
        <title>Welcome to chair-flight-webapp!</title>
      </Head>
      <CustomGlobalStyles />
      <PicoGlobalStyles />
      <Component {...pageProps} />
    </StrictMode>
  );
};

export default App;