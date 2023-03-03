import React, { StrictMode } from 'react';
import type { AppProps } from 'next/app';
import type { FunctionComponent } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { default as Head } from 'next/head';

import '@fontsource/public-sans';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import createEmotionCache from '../src/utils/createEmotionCache';

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

if (typeof document === 'undefined') {
  React.useLayoutEffect = React.useEffect;
}

const App: FunctionComponent<MyAppProps> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) => {
  return (
    <StrictMode>
      <Head>
        <title>Welcome to chair-flight!</title>
      </Head>
      <CacheProvider value={emotionCache}>
        <CssVarsProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </CssVarsProvider>
      </CacheProvider>
    </StrictMode>
  );
};

export default App;
