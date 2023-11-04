"use client";

import { default as Image } from "next/image";
import { MDXProvider } from "@mdx-js/react";
import { default as KeyboardArrowLeftIcon } from "@mui/icons-material/KeyboardArrowLeft";
import { Box, Link, Divider, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import {
  AppLayout,
  BlogPostChip,
  Header,
} from "@chair-flight/react/components";
import { AppHead } from "@chair-flight/react/containers";
import type { BlogPostTag } from "@chair-flight/react/components";
import type { FunctionComponent, PropsWithChildren } from "react";

export type BlogPageMeta = {
  title: string;
  linkTitle: string;
  description: string;
  imageUrl: string;
  file: string;
  tags: BlogPostTag[];
  author: string;
  isoDate: string;
};

export type BlogPageLayoutProps = PropsWithChildren<{
  meta: BlogPageMeta;
}>;

export const BlogPageLayout: FunctionComponent<BlogPageLayoutProps> = ({
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
              <>
                <Link
                  sx={{ flex: 0, mr: "auto", pb: 2 }}
                  color="primary"
                  underline="none"
                  href="/articles/blog"
                  startDecorator={<KeyboardArrowLeftIcon />}
                  children="Back"
                />
                <Typography
                  level="body-sm"
                  children={DateTime.fromISO(meta.isoDate).toFormat(
                    "dd LLL yyyy",
                  )}
                />
                <Typography
                  level="h2"
                  component="h1"
                  sx={{ fontWeight: "bold", mb: 0.5 }}
                  children={children}
                />
                <Divider sx={{ width: "100%", my: 2 }} />
                <Box>
                  {meta.tags.map((tag) => (
                    <BlogPostChip
                      key={tag}
                      tag={tag}
                      variant="soft"
                      slotProps={{
                        action: {
                          component: Link,
                          href: `/articles/blog?tag=${tag}`,
                        },
                      }}
                    />
                  ))}
                </Box>
              </>
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
            hr: () => <Divider sx={{ width: "100%", my: 2 }} />,
          }}
        />
      </AppLayout.Main>
    </>
  );
};
