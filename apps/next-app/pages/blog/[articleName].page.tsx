import * as fs from "node:fs/promises";
import path from "node:path";
import { useEffect } from "react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { default as AirplaneTicketIcon } from "@mui/icons-material/AirplaneTicket";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as FlightTakeoffIcon } from "@mui/icons-material/FlightTakeoff";
import { default as KeyboardArrowLeftIcon } from "@mui/icons-material/KeyboardArrowLeft";
import { default as StyleIcon } from "@mui/icons-material/Style";
import { Box, Link, Divider, Typography, GlobalStyles, Stack } from "@mui/joy";
import { getRequiredParam } from "libs/react/containers/src/wraper";
import { DateTime } from "luxon";
import { z } from "zod";
import {
  AppHead,
  BackgroundFadedImage,
  BlogPostChip,
  MarkdownClientDemo,
  ModuleSelectionButton,
} from "@chair-flight/react/components";
import {
  AnnexSearch,
  LayoutPublic,
  QuestionOverview,
  QuestionSearch,
} from "@chair-flight/react/containers";
import { useUserVoyage } from "@chair-flight/react/containers";
import { staticHandler, staticPathsHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

const metaSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
  date: z.string(),
  imageUrl: z.string().optional(),
  tag: z.enum(["Technical", "Feature", "Content"]),
});

type PageProps = {
  meta: z.infer<typeof metaSchema>;
  mdxSource: MDXRemoteSerializeResult;
};

type PageParams = {
  articleName: string;
};

export const Page: NextPage<PageProps> = ({ mdxSource, meta }) => {
  useEffect(() => useUserVoyage.markBlogAsVisited, []);

  return (
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <GlobalStyles
        styles={{
          main: {
            "h1, h2, h3, h4, h5": { marginTop: "1em" },
          },
        }}
      />
      <AppHead
        title={meta.title}
        linkTitle={meta.title}
        linkDescription={meta.description}
      />

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
        children={DateTime.fromISO(meta.date).toFormat("dd LLL yyyy")}
      />
      <Typography
        level="h2"
        component="h1"
        sx={{ fontWeight: "bold" }}
        children={meta.title}
      />
      <Divider sx={{ width: "100%", mb: 1 }} />
      <Box sx={{ mb: 4 }}>
        <BlogPostChip
          tag={meta.tag}
          variant="soft"
          slotProps={{
            action: {
              component: Link,
              href: `/articles/blog?tag=${meta.tag}`,
            },
          }}
        />
      </Box>

      <MDXRemote
        {...mdxSource}
        components={{
          h1: () => {
            throw new Error("No H1 components in blog posts!");
          },
          h2: ({ children }) => (
            <Typography
              sx={{ mt: "1em" }}
              level="h2"
              component="h2"
              children={children}
            />
          ),
          h3: ({ children }) => (
            <Typography
              sx={{ mt: "1em" }}
              level="h3"
              component="h3"
              children={children}
            />
          ),
          h4: ({ children }) => (
            <Typography
              sx={{ mt: "1em" }}
              level="h4"
              component="h4"
              children={children}
            />
          ),
          h5: ({ children }) => (
            <Typography
              sx={{ mt: "1em" }}
              level="h5"
              component="h5"
              children={children}
            />
          ),
          hr: () => <Divider sx={{ width: "100%", my: 2 }} />,
          p: ({ children }) => (
            <Typography
              sx={{ mt: "0.5em" }}
              level="body-md"
              component="p"
              children={children}
            />
          ),
          a: ({ children, href }) => <Link children={children} href={href} />,
          ul: ({ children }) => (
            <Box component="ul" children={children} sx={{ pl: 3 }} />
          ),
          blockquote: ({ children }) => (
            <Box
              children={children}
              component="blockquote"
              sx={{
                mx: 0,
                p: 2,
                borderRadius: 8,
                borderLeft: "solid 8px",
                borderLeftColor: (t) => t.vars.palette.text.tertiary,
                "--joy-palette-text-secondary": (t) =>
                  t.vars.palette.text.tertiary,
                color: (t) => t.vars.palette.text.tertiary,
                background: (t) => t.vars.palette.background.surface,
              }}
            />
          ),
          Stack,
          Link,
          AnnexSearch,
          ModuleSelectionButton,
          QuestionOverview,
          MarkdownClientDemo,
          AirplaneTicketIcon,
          ChevronRightIcon,
          FlightTakeoffIcon,
          StyleIcon,
          QuestionSearch,
        }}
      />

      <Typography
        level="h3"
        component="span"
        sx={{ fontWeight: "bold", my: 4, textAlign: "center" }}
        children={"See you in the Skies!"}
      />
    </LayoutPublic>
  );
};

const MATCH_CODE_BLOCKS = /```tsx eval((?:.|\n)*?)```/g;
const RELATIVE_PATH_TO_BLOG = "./public/content/content-blog/";

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    const articleName = getRequiredParam(params, "articleName");
    await LayoutPublic.getData({ helper, params });

    const file = path.join(
      process.cwd(),
      RELATIVE_PATH_TO_BLOG,
      articleName,
      "page.md",
    );

    const source = await fs.readFile(file);
    const sourceString = source.toString().replaceAll(MATCH_CODE_BLOCKS, "$1");
    const opts = { parseFrontmatter: true };
    const mdxSource = await serialize(sourceString, opts);
    const meta = metaSchema.parse(mdxSource.frontmatter);
    return { props: { mdxSource, meta } };
  },
  fs,
);

export const getStaticPaths = staticPathsHandler<PageParams>(
  async ({ helper }) => {
    const { meta } = await helper.blog.getBlogPostsMeta.fetch();
    const paths = meta.map((meta) => ({
      params: { articleName: meta.filename },
    }));
    return { fallback: false, paths };
  },
  fs,
);

export default Page;
