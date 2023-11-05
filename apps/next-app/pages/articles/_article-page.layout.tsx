"use client";

import { default as Image } from "next/image";
import { MDXProvider } from "@mdx-js/react";
import { Divider, Typography, styled } from "@mui/joy";
import { Header } from "@chair-flight/react/components";
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

const BackgroundImageContainer = styled("div")`
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  & > img {
    user-select: none;
    width: 600px;
    max-width: 600px;
    height: auto;
    mask: linear-gradient(90deg, rgba(0, 0, 0, 0.2), transparent) top right /
      cover;
  }
`;

const Main = styled("main")`
  width: 100%;
  margin: ${({ theme }) => theme.spacing(0, "auto")};
  padding: ${({ theme }) => theme.spacing(0, 1)};
`;

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
      <BackgroundImageContainer>
        <Image src="/images/background-article.png" fill alt="cool cockpit" />
      </BackgroundImageContainer>
      <Main
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
      </Main>
    </>
  );
};
