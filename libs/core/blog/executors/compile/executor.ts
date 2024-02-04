import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parse } from "yaml";
import { NOOP } from "@chair-flight/base/utils";
import { blogPostSchema } from "../../src";
import type { BlogPost } from "@chair-flight/base/types";
import type { ExecutorContext } from "@nx/devkit";

type ExecutorOptions = Record<string, never>;

const MATTER_REGEX =
  /^---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/;

const runExecutor = async (_: ExecutorOptions, context: ExecutorContext) => {
  const projects = context.workspace?.projects ?? {};
  const nextProjectName = "next-app";

  /** i.e.: `content-blog` */
  const projectName = context.projectName ?? "";
  /** i.e.: `libs/content/blog` */
  const contentRoot = projects[projectName]?.root ?? "";
  /** i.e.: `libs/content/blog/posts` */
  const blogPostsFolder = path.join(contentRoot, "posts");
  /** i.e.: `apps/next-app */
  const outputProject = projects[nextProjectName]?.root ?? "";
  /** i.e.: `apps/next-app/public/content/content-blog` */
  const outputDir = path.join(outputProject, "public", "content", projectName);
  /** i.e.: `apps/next-app/public/content/blog/meta.json` */
  const outputBlogMeta = path.join(outputDir, "meta.json");

  const posts = await fs.readdir(blogPostsFolder);
  const parsedPosts: BlogPost[] = [];

  for (const post of posts) {
    /** i.e.: `libs/content/blog/posts/001-post/page.md` */
    const postPage = path.join(blogPostsFolder, post, "page.md");
    const source = (await fs.readFile(postPage)).toString();
    const match = MATTER_REGEX.exec(source);
    if (!match) throw new Error(`Missing frontMatter for ${post}`);
    const data = parse(match[1]);
    const content = source.split("\n---").slice(1).join().trim();
    data.filename = post;
    data.content = content;
    data.imageUrl ??= null;
    const meta = blogPostSchema.parse(data);
    parsedPosts.push(meta);
  }

  await fs
    .rm(path.join(process.cwd(), outputDir), { recursive: true })
    .catch(NOOP);

  await fs.cp(
    path.join(process.cwd(), blogPostsFolder),
    path.join(process.cwd(), outputDir),
    { recursive: true },
  );

  parsedPosts.reverse();
  await fs.writeFile(outputBlogMeta, JSON.stringify(parsedPosts, null, 2));

  return {
    success: true,
  };
};

export default runExecutor;
