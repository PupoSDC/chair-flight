import Link from "next/link";
import { default as KeyboardArrowRightIcon } from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/joy";
import { DateTime } from "luxon";
import { Blog } from "@cf/providers/blog";
import { AppMain, BlogPostChip } from "@cf/react/components";
import type { FunctionComponent } from "react";

const getData = async () => {
  const blog = Blog.get();
  const allPosts = await blog.getAllPosts();
  const meta = allPosts.map(({ content, ...meta }) => meta);
  return { meta };
};

const BlogIndex: FunctionComponent = async () => {
  const { meta } = await getData();

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
    </AppMain>
  );
};

export default BlogIndex;
