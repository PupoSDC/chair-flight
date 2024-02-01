import type { MiniFs } from "@chair-flight/base/types";

export type BlogPost = {
  title: string;
  filename: string;
  description: string;
  author: string;
  date: string;
  imageUrl: string | null;
  content: string;
  tag: "Technical" | "Feature" | "Content";
};

export interface Blog {
  getDateOfLastPost: () => Promise<string>;
  getAllPosts: () => Promise<BlogPost[]>;
  getPost: (postId: string) => Promise<BlogPost>;
  preloadForStaticRender: (args: MiniFs) => Promise<void>;
}
