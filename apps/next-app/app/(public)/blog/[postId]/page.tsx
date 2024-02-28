import * as fs from "node:fs/promises";
import { default as AirplaneTicketIcon } from "@mui/icons-material/AirplaneTicket";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as FlightTakeoffIcon } from "@mui/icons-material/FlightTakeoff";
import { default as KeyboardArrowLeftIcon } from "@mui/icons-material/KeyboardArrowLeft";
import { default as StyleIcon } from "@mui/icons-material/Style";
import { Box, Divider, Link, Stack, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import { SearchAnnexes, SearchQuestions } from "@cf/next/search";
import { AppMain, MdxRemote } from "@cf/next/ui";
import { BugReportButton } from "@cf/next/user";
import { Blog } from "@cf/providers/blog";
import { BlogPostChip, ModuleSelectionButton } from "@cf/react/ui";
import type { FunctionComponent } from "react";

const getCompileTimeBlog = async () => {
  const blog = new Blog();
  await blog.preloadForStaticRender(fs);
  return blog;
};

type BlogPostProps = {
  params: { postId: string };
};

const BlogPost: FunctionComponent<BlogPostProps> = async ({ params }) => {
  const blog = await getCompileTimeBlog();
  const meta = await blog.getPost(params.postId);

  const post = {
    title: meta.title,
    description: meta.description,
    tag: meta.tag,
    date: meta.date,
    tagHref: `/blog?tag=${meta.tag}`,
  };

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

      <MdxRemote
        source={meta.content}
        components={{
          BugReportButton,
          Stack,
          SearchAnnexes,
          SearchQuestions,
          ModuleSelectionButton,
          AirplaneTicketIcon,
          ChevronRightIcon,
          FlightTakeoffIcon,
          StyleIcon,
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
  const blog = await getCompileTimeBlog();
  const allPosts = await blog.getAllPosts();
  const paths = allPosts.map((post) => ({
    params: { postId: post.filename },
  }));

  return paths;
};

export default BlogPost;
export const dynamicParams = true;
