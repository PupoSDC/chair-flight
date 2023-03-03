import React, { StrictMode } from 'react';
import type { AppProps } from 'next/app';
import type { FunctionComponent } from 'react';
import { default as Head } from 'next/head';

if (typeof document === 'undefined') {
  React.useLayoutEffect = React.useEffect;
}

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <StrictMode>
      <Head>
        <title>Welcome to chair-flight-server!</title>
      </Head>
      <Component {...pageProps} />
    </StrictMode>
  );
};

export default App;
