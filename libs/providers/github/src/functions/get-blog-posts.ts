import { DateTime } from "luxon";
import { parse } from "yaml";
import { z } from "zod";
import { originBranch, originOwner, originRepo } from "../common/env";
import { blogPostSchema } from "../entities/blog-post";
import type { BlogPost } from "../entities/blog-post";
import type { Octokit } from "octokit";

let CACHE: { posts: BlogPost[] } | null = null;

export const getBlogPosts = async (octokit: Octokit) => {
  if (!CACHE) {
    const MATTER_REGEX =
      /^---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/;

    const fileList = z
      .object({
        path: z.string(),
        name: z.string(),
      })
      .array();

    const rawFileSchema = z.object({
      data: z.string(),
    });

    const postsDir = await octokit.rest.repos.getContent({
      owner: originOwner,
      repo: originRepo,
      ref: originBranch,
      path: "libs/content/blog/posts",
    });

    const postFiles = fileList.parse(postsDir.data);

    const posts = await Promise.all(
      postFiles.map(async (file) => {
        const path = `${file.path}/page.md`;
        const name = file.name;
        const { data: source } = rawFileSchema.parse(
          await octokit.rest.repos.getContent({
            owner: originOwner,
            repo: originRepo,
            ref: originBranch,
            path: path,
            mediaType: {
              format: "raw",
            },
          }),
        );

        const match = MATTER_REGEX.exec(source);
        if (!match) throw new Error(`Missing frontMatter for ${name}`);

        const data = parse(match[1]);
        const meta = blogPostSchema.parse({
          id: name,
          title: data.title,
          description: data.title,
          author: data.author,
          content: source.split("\n---").slice(1).join().trim(),
          tag: data.tag,
          imageUrl: data.imageUrl,
          date: DateTime.fromFormat(data.date, "yyyy-MM-dd").toJSDate(),
        });
        return meta;
      }),
    );

    CACHE = { posts: posts.toReversed() };
  }

  return CACHE;
};

export const getBlogPost = async (octokit: Octokit, postId: string) => {
  const { posts } = await getBlogPosts(octokit);
  const post = posts.find((p) => p.id === postId);
  if (!post) throw new Error(`Post ${postId} not found`);
  return post;
};
