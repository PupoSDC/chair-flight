import { MDXProvider } from '@mdx-js/react';
import { AppHead } from '../../src/components/app-head';
import { AppHeader } from '@chair-flight/chair-flight-components';

import type { FunctionComponent, PropsWithChildren } from 'react';
import { Typography } from '@mui/joy';

type ArticlePageLayoutProps = PropsWithChildren<{
  meta: {
    title: string;
    linkTitle: string;
    description: string;
    imageUrl: string;
  };
}>;

export const ArticlePageLayout: FunctionComponent<ArticlePageLayoutProps> = ({
  meta,
  children,
}) => {
  return (
    <>
      <AppHead
        title={meta.title}
        linkTitle={meta.linkTitle}
        description={meta.description}
        imageUrl={`${process.env.NEXT_PUBLIC_APP_URL}${meta.imageUrl}`}
      />
      <AppHeader />
      <main>
        <MDXProvider
          children={children}
          components={{
            h1: ({ children }) => (
              <Typography
                level="h3"
                component="h1"
                sx={{ fontWeight: 900, mb: 0.5 }}
                children={children}
              />
            ),
            h2: ({ children }) => (
              <Typography
                level="h4"
                component="h2"
                sx={{ fontWeight: 900 }}
                children={children}
              />
            ),
            h3: ({ children }) => (
              <Typography
                level="h5"
                component="h3"
                sx={{ fontWeight: 900 }}
                children={children}
              />
            ),
            h4: ({ children }) => (
              <Typography
                level="h5"
                component="h4"
                sx={{ fontWeight: 700 }}
                children={children}
              />
            ),
            h5: ({ children }) => (
              <Typography
                level="h5"
                component="h5"
                sx={{ fontWeight: 500 }}
                children={children}
              />
            ),
            h6: ({ children }) => (
              <Typography level="h6" component="h6" children={children} />
            ),
          }}
        />
      </main>
      <style jsx>{`
        main {
          width: 100%;
          padding: 0.5em 1em;
          margin: 0 auto;
          max-width: 720px;
        }

        main > :global(h3) {
          margin-bottom: 0.5em;
        }
      `}</style>
    </>
  );
};
