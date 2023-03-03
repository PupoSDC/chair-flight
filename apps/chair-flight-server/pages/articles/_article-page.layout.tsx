import { MDXProvider } from '@mdx-js/react';
import { AppHead } from '../../src/components/app-head';
import { AppHeader } from '../../src/components/app-header';

import type { FunctionComponent, PropsWithChildren } from 'react';

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
        <MDXProvider>{children}</MDXProvider>
      </main>
      <style jsx>{`
        main {
          width: 100%;
          padding: 0.5em 1em;
          margin: 0 auto;
          max-width: 720px;
        }

        main > :global(h1) {
          margin-bottom: 0.5em;
        }

        main > :global(h3) {
          margin-bottom: 0.5em;
        }
      `}</style>
    </>
  );
};
