import { MDXRemote } from "@daviereid/next-mdx-remote/rsc";
import { default as KeyboardArrowLeftIcon } from "@mui/icons-material/KeyboardArrowLeft";
import { Box, Divider, Link, Stack, Typography } from "@mui/joy";
import { BugReportButton } from "apps/next-app/app/_client/app-buttons";
import { DateTime } from "luxon";
import { markdownPlugins } from "@cf/core/markdown";
import { Blog } from "@cf/providers/blog";
import { AppMain, BlogPostChip } from "@cf/react/components";
import { markdownComponents } from "@cf/react/markdown";
import type { FunctionComponent } from "react";

type Params = { postId: string };
type BlogPostProps = { params: Params };

const getBlogPost = async (params: Params) => {
  const blog = Blog.get();
  const meta = await blog.getPost(params.postId);
  const MATCH_CODE_BLOCKS = /```tsx eval((?:.|\n)*?)```/g;

  const post = {
    content: meta.content.replaceAll(MATCH_CODE_BLOCKS, "$1"),
    title: meta.title,
    description: meta.description,
    tag: meta.tag,
    date: meta.date,
    tagHref: `/blog?tag=${meta.tag}`,
  };

  return { post };
};

const BlogPost: FunctionComponent<BlogPostProps> = async ({ params }) => {
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

      <MDXRemote
        source={post.content}
        components={{
          ...markdownComponents,
          BugReportButton,
          Stack,
        }}
        {...markdownPlugins}
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
  const blog = Blog.get();
  const allPosts = await blog.getAllPosts();
  const posts = allPosts.map(({ filename: postId }) => postId);
  return posts.map((postId) => ({ postId }));
};

export default BlogPost;
