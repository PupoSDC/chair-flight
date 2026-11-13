import { createFileRoute, Link } from "@tanstack/react-router";
import { formatIsoDateAsDate } from "../../libs/base/format-values";
import { PublicHeader } from "../../libs/ui/components/base/public-header";
import { cn } from "../../libs/ui/utils/cn";
import { fetchBlogPosts } from "../-server-functions/blog/fetch-blog-posts";
import type { FC } from "react";

const BlogPage: FC = () => {
  const posts = Route.useLoaderData();

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8">
        <h1 className="m-0 text-3xl font-bold">Blog</h1>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                to="/blog/$postId"
                params={{ postId: post.id }}
                className={cn(
                  "group flex flex-col gap-1 rounded-lg border border-rule",
                  "bg-paper p-4 text-ink no-underline hover:border-accent",
                )}
              >
                <span className="text-xs text-muted">
                  {formatIsoDateAsDate(post.date)} · {post.tag}
                </span>
                <span className="text-lg font-semibold group-hover:text-accent">
                  {post.title}
                </span>
                <span className="text-sm text-muted">{post.description}</span>
                <span className="text-xs text-muted">{post.author}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/(public)/blog/")({
  loader: () => fetchBlogPosts(),
  head: () => ({ meta: [{ title: "Blog · Chair Flight" }] }),
  component: BlogPage,
});
