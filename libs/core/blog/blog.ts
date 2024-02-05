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
