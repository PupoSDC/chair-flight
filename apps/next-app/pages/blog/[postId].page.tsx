import { default as AirplaneTicketIcon } from "@mui/icons-material/AirplaneTicket";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as FlightTakeoffIcon } from "@mui/icons-material/FlightTakeoff";
import { default as KeyboardArrowLeftIcon } from "@mui/icons-material/KeyboardArrowLeft";
import { default as StyleIcon } from "@mui/icons-material/Style";
import { Box, Divider, Link, Stack, Typography } from "@mui/joy";
import { BugReportButton } from "libs/next/user/src/components/app-buttons";
import { DateTime } from "luxon";
import { compileMdx } from "@cf/core/markdown";
import { AppHead, LayoutPublic } from "@cf/next/public";
import { AnnexSearch, QuestionSearch } from "@cf/next/question-bank";
import { Github } from "@cf/providers/github";
import { Mdx } from "@cf/react/markdown";
import {
  BackgroundFadedImage,
  BlogPostChip,
  ModuleSelectionButton,
} from "@cf/react/web";
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
          AnnexSearch,
          ModuleSelectionButton,
          AirplaneTicketIcon,
          ChevronRightIcon,
          FlightTakeoffIcon,
          StyleIcon,
          QuestionSearch,
          BugReportButton,
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
  const github = new Github();
  const rawPost = await github.getBlogPost(params.postId);
  const mdxContent = await compileMdx(rawPost.content);

  const post = {
    postId: params.postId,
    mdxContent,
    title: rawPost.title,
    description: rawPost.description,
    tag: rawPost.tag,
    date: DateTime.fromJSDate(rawPost.date).toFormat("dd LLL yyyy"),
    tagHref: `/blog?tag=${rawPost.tag}`,
  };

  return { props: post };
};

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const github = new Github();
  const { posts } = await github.getBlogPosts();
  const paths = posts.map(({ id }) => ({ params: { postId: id } }));
  return { fallback: false, paths };
};

export default Page;
