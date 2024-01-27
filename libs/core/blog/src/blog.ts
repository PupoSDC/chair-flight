import { getUrlPathOnServer } from "@chair-flight/base/env";
import { NotFoundError } from "@chair-flight/base/errors";
import type { BlogPost } from "@chair-flight/base/types";

type ReadFile = (path: string, string: "utf-8") => Promise<string>;

interface IBlog {
  getAllPosts: () => Promise<BlogPost[]>;
  getPost: (postId: string) => Promise<BlogPost>;
  preloadForStaticRender: (args: { readFile: ReadFile }) => Promise<void>;
}

export class Blog implements IBlog {
  private postMeta: BlogPost[] | undefined = undefined;

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
    if (!post) throw new NotFoundError();
    return post;
  }

  async preloadForStaticRender({ readFile }: { readFile: ReadFile }) {
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

export const blog = new Blog();
