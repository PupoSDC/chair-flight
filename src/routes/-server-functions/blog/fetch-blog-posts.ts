import { createServerFn } from "@tanstack/react-start";
import { readBlogPosts } from "./read-blog-posts";

export const fetchBlogPosts = createServerFn({ method: "GET" }).handler(
  async () => readBlogPosts().map(({ content, ...post }) => post),
);
