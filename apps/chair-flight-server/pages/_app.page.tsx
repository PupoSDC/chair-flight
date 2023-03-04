import React, { StrictMode } from 'react';
import type { AppProps } from 'next/app';
import type { FunctionComponent } from 'react';
import { default as Head } from 'next/head';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { createEmotionCache } from '../src/utils/createEmotionCache';

import '@fontsource/public-sans';

if (typeof document === 'undefined') {
  React.useLayoutEffect = React.useEffect;
}

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <StrictMode>
      <Head>
        <title>Welcome to chair-flight!</title>
      </Head>
      <CssVarsProvider defaultMode="system">
        <CssBaseline />
        <Component {...pageProps} />
      </CssVarsProvider>
    </StrictMode>
  );
};

export default App;
