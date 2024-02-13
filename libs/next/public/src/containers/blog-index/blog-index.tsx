import { useEffect } from "react";
import { default as KeyboardArrowRightIcon } from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
} from "@mui/joy";
import { DateTime } from "luxon";
import { useUserVoyage } from "@cf/next/user";
import { BlogPostChip } from "@cf/react/components";
import { trpc } from "@cf/trpc/client";
import { container } from "@cf/trpc/client";
import type { Container } from "@cf/trpc/client";
import type { AppRouterOutput } from "@cf/trpc/client";

type Props = Record<string, never>;
type Params = Props;
type Data = AppRouterOutput["containers"]["blog"]["getBlogIndex"];

export const BlogIndex: Container<Props, Params, Data> = container<
  Props,
  Params,
  Data
>((params) => {
  const { meta } = BlogIndex.useData(params);

  useEffect(() => useUserVoyage.markBlogAsVisited, []);

  return (
    <>
      <Typography level="h2" sx={{ pt: 4 }}>
        Posts
      </Typography>
      {meta.map((post) => (
        <Card sx={{ mt: 2 }} key={post.filename}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <BlogPostChip key={post.tag} tag={post.tag} size="sm" />
            </Box>
            <Typography level="h3" color="primary">
              {post.title}
            </Typography>
            <Typography level="body-sm">{post.description}</Typography>
          </CardContent>
          <CardActions>
            <Box>
              <Typography level="body-sm">{post.author}</Typography>
              <Typography level="body-xs">
                {DateTime.fromISO(post.date).toFormat("dd LLL yyyy")}
              </Typography>
            </Box>
            <Button
              color="primary"
              variant="plain"
              component={Link}
              href={`/articles/blog/${post.filename}`}
              children="Read&nbsp;More"
              endDecorator={<KeyboardArrowRightIcon />}
              sx={{ flex: 0, ml: "auto" }}
            />
          </CardActions>
        </Card>
      ))}
      <Box component="footer" sx={{ py: 2 }} />
    </>
  );
});

BlogIndex.displayName = "BlogIndex";

BlogIndex.getData = async ({ helper }) => {
  const router = helper.containers.blog;
  return await router.getBlogIndex.fetch({});
};

BlogIndex.useData = () => {
  const router = trpc.containers.blog;
  return router.getBlogIndex.useSuspenseQuery({})[0];
};
