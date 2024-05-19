import { default as AirplaneTicketIcon } from "@mui/icons-material/AirplaneTicket";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as FlightTakeoffIcon } from "@mui/icons-material/FlightTakeoff";
import { default as KeyboardArrowLeftIcon } from "@mui/icons-material/KeyboardArrowLeft";
import { default as StyleIcon } from "@mui/icons-material/Style";
import { Box, Divider, Link, Stack, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import { compileMdx } from "@cf/core/markdown";
import { Blog } from "@cf/providers/content";
import { Mdx } from "@cf/react/markdown";
import {
  BackgroundFadedImage,
  BlogPostChip,
  ModuleSelectionButton,
} from "@cf/react/web";
import { AppHead } from "../_components/app-head";
import { LayoutPublic } from "../_components/layout-public";
import type { MdxDocument } from "@cf/core/markdown";
import type { BlogPostTag } from "@cf/react/web";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type PageParams = {
  postId: string;
};

type PageProps = {
  postId: string;
  title: string;
  description: string;
  mdxContent: MdxDocument;
  tag: BlogPostTag;
  tagHref: string;
  date: string;
};

export const Page: NextPage<PageProps> = ({
  mdxContent,
  title,
  description,
  tag,
  tagHref,
  date,
}) => {
  return (
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <AppHead title={title} linkTitle={title} linkDescription={description} />
      <Link
        sx={{ flex: 0, mr: "auto", pb: 2 }}
        color="primary"
        underline="none"
        href="/blog"
        startDecorator={<KeyboardArrowLeftIcon />}
        children="Back"
      />
      <Typography level="body-sm" children={date} />
      <Typography
        level="h2"
        component="h1"
        sx={{ fontWeight: "bold" }}
        children={title}
      />
      <Divider sx={{ width: "100%", mb: 1 }} />
      <Box sx={{ mb: 4 }}>
        <BlogPostChip
          tag={tag}
          variant="soft"
          slotProps={{
            action: {
              component: Link,
              href: tagHref,
            },
          }}
        />
      </Box>

      <Mdx
        children={mdxContent}
        components={{
          Box,
          Stack,
          Link,
          // AnnexSearch,
          ModuleSelectionButton,
          AirplaneTicketIcon,
          ChevronRightIcon,
          FlightTakeoffIcon,
          StyleIcon,
          // QuestionSearch,
          // BugReportButton,
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

export const getStaticProps: GetStaticProps<PageProps, PageParams> = async ({
  params,
}) => {
  if (!params) throw new Error("No params");
  const blog = new Blog();
  const { post } = await blog.getBlogPost(params.postId);
  const mdxContent = await compileMdx(post.content);

  const props = {
    postId: params.postId,
    mdxContent,
    title: post.title,
    description: post.description,
    tag: post.tag,
    date: DateTime.fromJSDate(post.createdAt).toFormat("dd LLL yyyy"),
    tagHref: `/blog?tag=${post.tag}`,
  };

  return { props };
};

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const blog = new Blog();
  const { posts } = await blog.getBlogPosts();
  const paths = posts.map(({ id }) => ({ params: { postId: id } }));
  return { fallback: false, paths };
};

export default Page;
