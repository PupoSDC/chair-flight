import { DateTime } from "luxon";
import { getUrlPathOnServer } from "@cf/base/env";
import { NotFoundError } from "@cf/base/errors";
import type { BlogPost } from "./entities/blog-post";

const A_LONG_TIME_AGO = "2020-01-01T00:00:00.000";

interface BlogProvider {
  getDateOfLastPost: () => Promise<string>;
  getAllPosts: () => Promise<BlogPost[]>;
  getPost: (postId: string) => Promise<BlogPost>;
  preloadForStaticRender: (fs: MiniFs) => Promise<void>;
}

export class Blog implements BlogProvider {
  private postMeta: BlogPost[] | undefined = undefined;
  private static instance: Blog;

  private constructor() {}

  static get() {
    if (!Blog.instance) {
      Blog.instance = new Blog();
    }
    return Blog.instance;
  }

  async getDateOfLastPost() {
    const allPosts = await this.getAllPosts();
    const date = allPosts.at(0)?.date ?? A_LONG_TIME_AGO;
    const lastPostDate = DateTime.fromISO(date).toISO() ?? A_LONG_TIME_AGO;
    return lastPostDate;
  }

  async getAllPosts() {
    if (!this.postMeta) {
      const urlPath = getUrlPathOnServer();
      const blogPath = `/content/content-blog`;
      const baseApiPath = `${urlPath}${blogPath}`;
      const apiPath = `${baseApiPath}/meta.json`;
      const response = await fetch(apiPath);
      this.postMeta = (await response.json()) as BlogPost[];
    }
    return this.postMeta;
  }

  async getPost(docId: string) {
    const allPosts = await this.getAllPosts();
    const post = allPosts.find((p) => p.filename === docId);
    if (!post) throw new NotFoundError(`Post not found: ${docId}`);
    return post;
  }

  async preloadForStaticRender({ readFile }: MiniFs) {
    const cwd = process.cwd();
    const appPath = "/apps/next-app";
    const path = [
      cwd,
      cwd.includes(appPath) ? "" : appPath,
      `/public/content/content-blog/meta.json`,
    ].join("");
    const file = JSON.parse(await readFile(path, "utf-8"));
    this.postMeta = file as BlogPost[];
  }
}
