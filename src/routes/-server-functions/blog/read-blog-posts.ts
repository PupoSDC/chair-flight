import { parseBlogPost } from "../../../libs/core/blog/parse-blog-post";

const SOURCES = import.meta.glob<string>(
  "../../../../content/blog/posts/*/page.md",
  { query: "?raw", import: "default", eager: true },
);

const COVERS = Object.keys(
  import.meta.glob("../../../../content/blog/posts/*/cover.{jpg,png,webp}"),
);

export const readBlogPosts = () =>
  Object.entries(SOURCES)
    .map(([file, source]) => {
      const id = file.split("/").at(-2) ?? "";
      const cover = COVERS.find((path) => path.split("/").at(-2) === id);
      return {
        ...parseBlogPost(id, source),
        image: cover ? `/content/blog/${id}/${cover.split("/").at(-1)}` : null,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
