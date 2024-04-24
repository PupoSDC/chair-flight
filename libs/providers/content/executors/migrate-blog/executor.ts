import * as fs from "node:fs/promises";
import { DateTime } from "luxon";
import { parse } from "yaml";
import { DataError } from "@cf/base/errors";
import { blogPostSchema } from "@cf/core/blog";
import { Content } from "../../src/content";
import { getAllFiles } from "../../src/executors/get-all-files";
import type { BlogPost } from "@cf/core/blog";

type ExecutorOptions = {
  contentFolder: string;
};

const MATTER_REGEX =
  /^---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/;

const runExecutor = async ({ contentFolder }: ExecutorOptions) => {
  const content = new Content();
  const posts = await getAllFiles(contentFolder, "page.md");
  const parsedPosts: BlogPost[] = [];

  for (const post of posts) {
    const source = (await fs.readFile(post)).toString();
    const match = MATTER_REGEX.exec(source);
    const id = post.split("/").at(-1)?.split("-")[0];
    if (!match) throw new DataError(`Missing frontMatter for ${post}`);
    if (!id) throw new DataError("No ID could be inferred from post title");
    const data = parse(match[1]);
    const meta = blogPostSchema.parse({
      id: post.split("/").at(-1)?.split("-")[0],
      createdAt: DateTime.fromFormat(data.date, "yyyy-MM-dd").toJSDate(),
      updatedAt: DateTime.now().toJSDate(),
      title: data.title,
      description: data.title,
      author: data.author,
      content: source.split("\n---").slice(1).join().trim(),
      tag: data.tag,
      imageUrl: data.imageUrl ?? "/default",
    });
    parsedPosts.push(meta);
  }

  await content.updateBlog(parsedPosts);

  return {
    success: true,
  };
};

export default runExecutor;
