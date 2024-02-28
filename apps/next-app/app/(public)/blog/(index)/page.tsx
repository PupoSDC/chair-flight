import * as fs from "node:fs/promises";
import { default as Link } from "next/link";
import { default as KeyboardArrowRightIcon } from "@mui/icons-material/KeyboardArrowRight";
import { default as Box } from "@mui/joy/Box";
import { default as Button } from "@mui/joy/Button";
import { default as Card } from "@mui/joy/Card";
import { default as CardActions } from "@mui/joy/CardActions";
import { default as CardContent } from "@mui/joy/CardContent";
import { default as Typography } from "@mui/joy/Typography";
import { DateTime } from "luxon";
import { AppMain } from "@cf/next/ui";
import { Blog } from "@cf/providers/blog";
import { BlogPostChip } from "@cf/react/ui";
import type { FunctionComponent } from "react";

const BlogIndex: FunctionComponent = async () => {
  const blog = new Blog();
  await blog.preloadForStaticRender(fs);
  const allPosts = await blog.getAllPosts();
  const meta = allPosts.map(({ content, ...meta }) => ({
    ...meta,
    description: content.slice(0, 200),
    date: DateTime.fromISO(meta.date).toFormat("dd LLL yyyy"),
  }));

  return (
    <AppMain>
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
              <Typography level="body-xs">{post.date}</Typography>
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
    </AppMain>
  );
};

export default BlogIndex;
