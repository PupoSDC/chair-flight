import { default as Image } from "next/image";
import { MDXProvider } from "@mdx-js/react";
import { Box, Divider, Typography } from "@mui/joy";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { AppHead } from "@chair-flight/next/components";
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
        imageUrl={`${getEnvVariableOrThrow("NEXT_PUBLIC_APP_URL")}${
          meta.imageUrl
        }`}
      />
      <Header />
      <Box
        sx={{
          overflow: "hidden",
          position: "fixed",
          width: "100%",
          height: "100%",
          "& > img": {
            width: "600px",
            maxWidth: "600px",
            height: "auto",
            mask: "linear-gradient(90deg,rgba(0,0,0,0.2),transparent) top right /cover",
          },
        }}
      >
        <Image src="/images/article-background.png" fill alt="cool cockpit" />
      </Box>
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
