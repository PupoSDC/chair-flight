import { default as Image } from "next/image";
import { MDXProvider } from "@mdx-js/react";
import { Divider, Typography } from "@mui/joy";
import { AppHead } from "@chair-flight/next/client";
import { AppLayout, Header } from "@chair-flight/react/components";
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
        description={meta.description}
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
                level="h2"
                component="h1"
                sx={{ fontWeight: "bold", mb: 0.5 }}
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
            hr: () => <Divider sx={{ width: "100%", my: 2 }} />,
          }}
        />
      </AppLayout.Main>
    </>
  );
};
