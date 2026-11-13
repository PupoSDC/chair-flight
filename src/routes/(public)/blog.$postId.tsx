import { createFileRoute, Link } from "@tanstack/react-router";
import { formatIsoDateAsDate } from "../../libs/base/format-values";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { PublicHeader } from "../../libs/ui/components/base/public-header";
import { ChevronLeftIcon } from "../../libs/ui/icons/chevron-left-icon";
import { fetchBlogPost } from "../-server-functions/blog/fetch-blog-post";
import type { FC } from "react";

const BlogPostPage: FC = () => {
  const post = Route.useLoaderData();

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8">
        <Link
          to="/blog"
          className="flex items-center gap-1 text-sm text-muted no-underline"
        >
          <ChevronLeftIcon /> Blog
        </Link>
        <div>
          <h1 className="m-0 text-3xl font-bold">{post.title}</h1>
          <p className="m-0 mt-1 text-sm text-muted">
            {formatIsoDateAsDate(post.date)} · {post.author}
          </p>
        </div>
        <Markdown>{post.content}</Markdown>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/(public)/blog/$postId")({
  loader: ({ params }) => fetchBlogPost({ data: { postId: params.postId } }),
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? "Blog"} · Chair Flight` }],
  }),
  component: BlogPostPage,
});
