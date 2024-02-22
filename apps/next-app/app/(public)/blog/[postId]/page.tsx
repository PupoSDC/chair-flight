import { default as KeyboardArrowLeftIcon } from "@mui/icons-material/KeyboardArrowLeft";
import { Box, Divider, Link, Stack, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import { compileMdx } from "@cf/core/markdown";
import { BugReportButton } from "@cf/next/user";
import {
  AppMain,
  BlogPostChip,
  ModuleSelectionButton,
} from "@cf/react/components";
import { Mdx } from "@cf/react/markdown";
import { providers } from "@cf/trpc/server";
import type { FunctionComponent } from "react";

type Params = { postId: string };

const getBlogPost = async (params: Params) => {
  const meta = await providers.blog.getPost(params.postId);
  const mdxContent = await compileMdx(meta.content);

  const post = {
    mdxContent,
    title: meta.title,
    description: meta.description,
    tag: meta.tag,
    date: meta.date,
    tagHref: `/blog?tag=${meta.tag}`,
  };

  return { post };
};

const BlogPost: FunctionComponent<Params> = async (params) => {
  const { post } = await getBlogPost(params);

  return (
    <AppMain>
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
        children={DateTime.fromISO(post.date).toFormat("dd LLL yyyy")}
      />
      <Typography
        level="h2"
        component="h1"
        sx={{ fontWeight: "bold" }}
        children={post.title}
      />
      <Divider sx={{ width: "100%", mb: 1 }} />
      <Box sx={{ mb: 4 }}>
        <BlogPostChip
          tag={post.tag}
          variant="soft"
          slotProps={{
            action: {
              component: Link,
              href: post.tagHref,
            },
          }}
        />
      </Box>
      <Mdx
        children={post.mdxContent}
        components={{
          Box,
          Stack,
          Link,
          ModuleSelectionButton,
          BugReportButton,
        }}
      />

      <Typography
        level="h3"
        component="span"
        sx={{ fontWeight: "bold", my: 4, textAlign: "center" }}
        children={"See you in the Skies!"}
      />
    </AppMain>
  );
};

export const generateStaticParams = async () => {
  const allPosts = await providers.blog.getAllPosts();
  const posts = allPosts.map(({ filename: postId }) => postId);
  return posts.map((postId) => ({ postId }));
};

export default BlogPost;
