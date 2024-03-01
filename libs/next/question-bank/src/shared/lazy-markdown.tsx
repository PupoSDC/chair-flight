import { default as dynamic } from "next/dynamic";

export const LazyMarkdown = dynamic(() =>
  import("@cf/react/markdown").then((mod) => mod.Markdown),
);
