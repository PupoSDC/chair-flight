import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { readBlogPosts } from "./read-blog-posts";

export const fetchBlogPost = createServerFn({ method: "GET" })
  .validator(z.object({ postId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const post = readBlogPosts().find((item) => item.id === data.postId);
    if (!post) throw notFound();
    return post;
  });
