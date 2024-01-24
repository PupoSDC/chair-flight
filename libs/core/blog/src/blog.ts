import { getUrlPathOnServer } from "@chair-flight/base/env";
import type { BlogMeta } from "./meta-schema";

type ReadFile = (path: string, string: "utf-8") => Promise<string>;

interface IBlog {
  getAllPostsMeta: () => Promise<BlogMeta[]>;
  preloadForStaticRender: (args: { readFile: ReadFile }) => Promise<void>;
}

export class Blog implements IBlog {
  private postMeta: BlogMeta[] | undefined = undefined;

  async getAllPostsMeta() {
    if (!this.postMeta) {
      const urlPath = getUrlPathOnServer();
      const blogPath = `/content/content-blog`;
      const baseApiPath = `${urlPath}${blogPath}`;
      const apiPath = `${baseApiPath}/meta.json`;
      const response = await fetch(apiPath);
      this.postMeta = (await response.json()) as BlogMeta[];
    }
    return this.postMeta;
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
    this.postMeta = file as BlogMeta[];
  }
}

export const blog = new Blog();
