import { MDXProvider } from "@mdx-js/react";
import { default as KeyboardArrowLeftIcon } from "@mui/icons-material/KeyboardArrowLeft";
import { Box, Link, Divider, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import {
  AppHead,
  BackgroundFadedImage,
  BlogPostChip,
} from "@chair-flight/react/components";
import { LayoutPublic } from "@chair-flight/react/containers";
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
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <AppHead
        title={meta.title}
        linkTitle={meta.linkTitle}
        linkDescription={meta.description}
      />
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
                sx={{ fontWeight: "bold" }}
                children={children}
              />
              <Divider sx={{ width: "100%", mb: 1 }} />
              <Box sx={{ mb: 2 }}>
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
    </LayoutPublic>
  );
};
