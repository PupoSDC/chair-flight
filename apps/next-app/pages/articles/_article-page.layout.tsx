"use client";

import { default as Image } from "next/image";
import { MDXProvider } from "@mdx-js/react";
import { Divider, Typography } from "@mui/joy";
import { AppLayout, Header } from "@chair-flight/react/components";
import { AppHead } from "@chair-flight/react/containers";
import type { FunctionComponent, PropsWithChildren } from "react";

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
        linkDescription={meta.description}
      />
      <Header />
      <AppLayout.BackgroundImageContainer>
        <Image src="/images/background-article.png" fill alt="cool cockpit" />
      </AppLayout.BackgroundImageContainer>
      <AppLayout.Main
        sx={{
          p: { xs: 2, md: 4 },
          height: "initial",
          width: "100%",
          maxWidth: (t) => t.breakpoints.values.md,
        }}
      >
        <MDXProvider
          children={children}
          components={{
            h1: ({ children }) => (
              <Typography
                level="h1"
                component="h1"
                sx={{ mb: 0.5 }}
                children={children}
              />
            ),
            h2: ({ children }) => (
              <Typography level="h2" component="h2" children={children} />
            ),
            h3: ({ children }) => (
              <Typography level="h3" component="h3" children={children} />
            ),
            h4: ({ children }) => (
              <Typography level="h4" component="h4" children={children} />
            ),
            h5: ({ children }) => (
              <Typography level="h5" component="h5" children={children} />
            ),
            hr: () => <Divider sx={{ width: "100%", my: 2 }} />,
            p: ({ children }) => (
              <Typography level="body-md" component="p" children={children} />
            ),
          }}
        />
      </AppLayout.Main>
    </>
  );
};
