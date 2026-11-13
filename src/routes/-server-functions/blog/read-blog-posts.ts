import { parseBlogPost } from "../../../libs/core/blog/parse-blog-post";

const SOURCES = import.meta.glob<string>(
  "../../../../content/blog/posts/*/page.md",
  { query: "?raw", import: "default", eager: true },
);

export const readBlogPosts = () =>
  Object.entries(SOURCES)
    .map(([file, source]) =>
      parseBlogPost(file.split("/").at(-2) ?? "", source),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
