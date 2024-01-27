import * as fs from "node:fs/promises";
import { useEffect } from "react";
import { default as AirplaneTicketIcon } from "@mui/icons-material/AirplaneTicket";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as FlightTakeoffIcon } from "@mui/icons-material/FlightTakeoff";
import { default as KeyboardArrowLeftIcon } from "@mui/icons-material/KeyboardArrowLeft";
import { default as StyleIcon } from "@mui/icons-material/Style";
import { Box, Link, Divider, Typography, Stack } from "@mui/joy";
import { getRequiredParam } from "libs/react/containers/src/wraper";
import { DateTime } from "luxon";
import {
  AppHead,
  BackgroundFadedImage,
  BlogPostChip,
  Markdown,
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
import type { AppRouterOutput } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

type PageProps = AppRouterOutput["blog"]["getBlogPost"]["post"];
type PageParams = { postId: string };

export const Page: NextPage<PageProps> = (props) => {
  useEffect(() => useUserVoyage.markBlogAsVisited, []);

  return (
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <AppHead
        title={props.title}
        linkTitle={props.title}
        linkDescription={props.description}
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
        children={DateTime.fromISO(props.date).toFormat("dd LLL yyyy")}
      />
      <Typography
        level="h2"
        component="h1"
        sx={{ fontWeight: "bold" }}
        children={props.title}
      />
      <Divider sx={{ width: "100%", mb: 1 }} />
      <Box sx={{ mb: 4 }}>
        <BlogPostChip
          tag={props.tag}
          variant="soft"
          slotProps={{
            action: {
              component: Link,
              href: props.tagHref,
            },
          }}
        />
      </Box>

      <Markdown
        document={props.mdxContent}
        components={{
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

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    const postId = getRequiredParam(params, "postId");
    const { post } = await helper.blog.getBlogPost.fetch({ postId });
    await LayoutPublic.getData({ helper, params });
    return { props: post };
  },
  fs,
);

export const getStaticPaths = staticPathsHandler<PageParams>(
  async ({ helper }) => {
    const { meta } = await helper.blog.getBlogPostsMeta.fetch();
    const paths = meta.map((meta) => ({ params: { postId: meta.filename } }));
    return { fallback: false, paths };
  },
  fs,
);

export default Page;
