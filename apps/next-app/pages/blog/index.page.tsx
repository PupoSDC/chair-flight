import * as fs from "node:fs/promises";
import { useEffect, type FunctionComponent } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Card,
  CardContent,
  Link,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/joy";
import { DateTime } from "luxon";
import { default as dedent } from "ts-dedent";
import {
  AppHead,
  BackgroundFadedImage,
  BlogPostChip,
} from "@chair-flight/react/components";
import { LayoutPublic, useUserVoyage } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { BlogMeta } from "@chair-flight/core/blog";

export type PageProps = {
  meta: BlogMeta[];
};

const Page: FunctionComponent<PageProps> = ({ meta }) => {
  useEffect(() => useUserVoyage.markBlogAsVisited, []);
  return (
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <AppHead linkDescription={dedent``} />
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
    </LayoutPublic>
  );
};

export const getStaticProps = staticHandler<PageProps>(async ({ helper }) => {
  const props = await helper.blog.getBlogPostsMeta.fetch();
  return { props };
}, fs);

export default Page;
