import React, { StrictMode } from 'react';
import type { AppProps } from 'next/app';
import type { FunctionComponent } from 'react';
import { default as Head } from 'next/head';
import { CssBaseline, CssVarsProvider } from '@mui/joy';

import '@fontsource/public-sans';
import { theme } from './_theme';

if (typeof document === 'undefined') {
  React.useLayoutEffect = React.useEffect;
}

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <StrictMode>
      <Head>
        <title>Welcome to chair-flight!</title>
      </Head>
      <CssVarsProvider defaultMode="system" theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </CssVarsProvider>
    </StrictMode>
  );
};

export default App;
