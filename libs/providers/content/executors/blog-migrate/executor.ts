import * as fs from "node:fs/promises";
import * as path from "node:path";
import { DateTime } from "luxon";
import { parse } from "yaml";
import { sha256 } from "@cf/base/utils";
import { Content } from "../../src/content";
import { blogPostSchema } from "../../src/entities/blog-post";
import type { BlogPost } from "../../src/entities/blog-post";

type ExecutorOptions = {
  contentFolder: string;
};

const MATTER_REGEX =
  /^---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/;

const runExecutor = async ({ contentFolder }: ExecutorOptions) => {
  const content = new Content();
  const posts = await fs.readdir(contentFolder);
  const parsedPosts: BlogPost[] = [];

  for (const post of posts) {
    const postPage = path.join(contentFolder, post, "page.md");
    const source = (await fs.readFile(postPage)).toString();
    const match = MATTER_REGEX.exec(source);
    if (!match) throw new Error(`Missing frontMatter for ${post}`);
    const data = parse(match[1]);
    const meta = blogPostSchema.parse({
      id: post,
      hash: await sha256(source),
      createdAt: DateTime.fromFormat(data.date, "yyyy-MM-dd").toJSDate(),
      updatedAt: DateTime.now().toJSDate(),
      title: data.title,
      description: data.title,
      author: data.author,
      content: source.split("\n---").slice(1).join().trim(),
      tag: data.tag,
      imageUrl: data.imageUrl,
    });
    parsedPosts.push(meta);
  }

  await content.updateBlogPosts(parsedPosts);

  return {
    success: true,
  };
};

export default runExecutor;
