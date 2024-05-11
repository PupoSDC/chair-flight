import * as fs from "node:fs/promises";
import { DateTime } from "luxon";
import { parse } from "yaml";
import { DataError } from "@cf/base/errors";
import { blogPostSchema } from "@cf/core/blog";
import { getAllFiles } from "../../src/executors/get-all-files";
import { Content } from "../../src/providers/content";
import type { MediaFile } from "../../src/providers/content";
import type { BlogPost } from "@cf/core/blog";

type ExecutorOptions = {
  contentFolder: string;
};

const MATTER_REGEX =
  /^---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/;

const runExecutor = async ({ contentFolder }: ExecutorOptions) => {
  const content = new Content();
  const posts = await getAllFiles(contentFolder, "page.md");
  const videos = await getAllFiles(contentFolder, ".webm");
  const imagesPng = await getAllFiles(contentFolder, ".png");
  const imagesJpg = await getAllFiles(contentFolder, ".jpg");
  const parsedPosts: BlogPost[] = [];
  const parsedFiles: MediaFile[] = [];

  for (const media of [...videos, ...imagesPng, ...imagesJpg]) {
    const buffer = await fs.readFile(media);
    const blob = new Blob([buffer]);
    const id = "/blog/" + media.split("posts/")[1];
    const file = new File([blob], id);
    parsedFiles.push({ id, file });
  }

  const mediaMap = await content.updateMedia(parsedFiles);

  for (const post of posts) {
    const source = (await fs.readFile(post)).toString();
    const match = MATTER_REGEX.exec(source);
    const id = post.split("/").at(-2);
    if (!match) throw new DataError(`Missing frontMatter for ${post}`);
    if (!id) throw new DataError("No ID could be inferred from post title");

    let content = source.split("\n---").slice(1).join().trim();

    Object.entries(mediaMap).forEach(([key, value]) => {
      content = content.replaceAll(key, value);
    });

    const data = parse(match[1]);
    const meta = blogPostSchema.parse({
      id,
      content,
      createdAt: DateTime.fromFormat(data.date, "yyyy-MM-dd").toJSDate(),
      title: data.title,
      description: data.title,
      author: data.author,
      tag: data.tag,
      imageUrl: data.imageUrl ?? "/default",
    });
    parsedPosts.push(meta);
  }

  await content.updateBlogPosts(parsedPosts);

  return {
    success: true,
  };
};

export default runExecutor;
