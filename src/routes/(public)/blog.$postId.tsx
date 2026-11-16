import { createFileRoute, Link } from "@tanstack/react-router";
import { formatIsoDateAsDate } from "../../libs/base/format-values";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { ChevronLeftIcon } from "../../libs/ui/icons/chevron-left-icon";
import { CessnaProfile } from "../../libs/ui/outlines/cessna-profile";
import { cn } from "../../libs/ui/utils/cn";
import { fetchBlogPost } from "../-server-functions/blog/fetch-blog-post";
import type { FC } from "react";

const BlogPostPage: FC = () => {
  const post = Route.useLoaderData();

  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10",
        "sm:py-16",
      )}
    >
      <Link
        to="/blog"
        className={cn(
          "flex w-fit items-center gap-1 rounded-full border border-rule",
          "bg-paper/90 py-1.5 pr-3.5 pl-2.5 text-sm font-medium text-ink",
          "no-underline backdrop-blur transition-colors hover:border-accent",
        )}
      >
        <ChevronLeftIcon size={16} /> Blog
      </Link>
      <article
        className={cn(
          "flex flex-col gap-8 rounded-2xl border border-rule bg-paper/85",
          "p-5 backdrop-blur sm:p-10",
        )}
      >
        <div
          className={cn(
            "relative -mx-2 -mt-2 aspect-video overflow-hidden rounded-xl",
            "bg-accent-soft sm:-mx-6 sm:-mt-6 sm:aspect-[21/9]",
          )}
        >
          {post.image ? (
            <img
              src={post.image}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <CessnaProfile
              className={cn(
                "absolute inset-x-[10%] bottom-[10%] w-[80%] text-brand",
                "opacity-30",
              )}
            />
          )}
        </div>
        <header className="flex flex-col gap-3">
          <span className="text-xs text-muted">
            {formatIsoDateAsDate(post.date)}
          </span>
          <h1
            className={cn(
              "m-0 text-3xl leading-tight font-bold tracking-tighter",
              "sm:text-4xl",
            )}
          >
            {post.title}
          </h1>
        </header>
        <Markdown className="text-base leading-7">{post.content}</Markdown>
      </article>
    </main>
  );
};

export const Route = createFileRoute("/(public)/blog/$postId")({
  loader: ({ params }) => fetchBlogPost({ data: { postId: params.postId } }),
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? "Blog"} · Chair Flight` }],
  }),
  component: BlogPostPage,
});
