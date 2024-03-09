import * as fs from "node:fs/promises";
import { default as Typography } from "@mui/joy/Typography";
import { DateTime } from "luxon";
import { AppMain } from "@cf/next/ui";
import { Blog } from "@cf/providers/blog";
import { BlogCard } from "@cf/react/ui";
import type { FunctionComponent } from "react";

const BlogIndex: FunctionComponent = async () => {
  const blog = new Blog();
  await blog.preloadForStaticRender(fs);
  const allPosts = await blog.getAllPosts();
  const meta = allPosts.map(({ content, ...meta }) => ({
    ...meta,
    description: content.slice(0, 200),
    date: DateTime.fromISO(meta.date).toFormat("dd LLL yyyy"),
    href: `/blog/${meta.filename}`,
    imageUrl: undefined,
  }));

  return (
    <AppMain>
      <Typography level="h2" sx={{ pt: 4 }}>
        Posts
      </Typography>
      {meta.map((post) => (
        <BlogCard {...post} key={post.href} sx={{ mt: 2 }} />
      ))}
    </AppMain>
  );
};

export default BlogIndex;
