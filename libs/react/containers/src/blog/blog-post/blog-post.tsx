import { useEffect } from "react";
import { default as AirplaneTicketIcon } from "@mui/icons-material/AirplaneTicket";
import { default as ChevronRightIcon } from "@mui/icons-material/ChevronRight";
import { default as FlightTakeoffIcon } from "@mui/icons-material/FlightTakeoff";
import { default as KeyboardArrowLeftIcon } from "@mui/icons-material/KeyboardArrowLeft";
import { default as StyleIcon } from "@mui/icons-material/Style";
import { Box, Divider, Link, Stack, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import {
  BlogPostChip,
  Markdown,
  ModuleSelectionButton,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { AnnexSearch } from "../../annexes/annex-search";
import { BugReportButton } from "../../layouts/components/app-buttons/app-buttons";
import { QuestionOverview } from "../../questions/question-overview";
import { QuestionSearch } from "../../questions/question-search";
import { useUserVoyage } from "../../user/hooks/use-user-voyage";
import { container, getRequiredParam } from "../../wraper";
import type { Container } from "../../wraper/container";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = { postId: string };
type Params = Props;
type Data = AppRouterOutput["containers"]["blog"]["getBlogPost"];

export const BlogPost: Container<Props, Params, Data> = container<
  Props,
  Params,
  Data
>((params) => {
  const { post } = BlogPost.useData(params);

  useEffect(() => useUserVoyage.markBlogAsVisited, []);

  return (
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

      <Markdown
        document={post.mdxContent}
        components={{
          Box,
          Stack,
          Link,
          AnnexSearch,
          ModuleSelectionButton,
          QuestionOverview,
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
    </>
  );
});

BlogPost.displayName = "BlogPost";

BlogPost.getData = async ({ helper, params }) => {
  const router = helper.containers.blog;
  const postId = getRequiredParam(params, "postId");
  return await router.getBlogPost.fetch({ postId });
};

BlogPost.useData = (params) => {
  const router = trpc.containers.blog;
  const postId = getRequiredParam(params, "postId");
  return router.getBlogPost.useSuspenseQuery({ postId })[0];
};
