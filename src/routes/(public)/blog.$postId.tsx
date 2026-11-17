import { createFileRoute } from "@tanstack/react-router";
import { formatIsoDateAsDate } from "../../libs/base/format-values";
import { ButtonLink } from "../../libs/ui/components/base/button-link";
import { Markdown } from "../../libs/ui/components/base/markdown";
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
        <hr className="m-0 w-full border-0 border-t border-rule" />
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <ButtonLink to="/blog" size="large">
            Read more posts
          </ButtonLink>
          <ButtonLink to="/modules" variant="primary" size="large">
            Start studying
          </ButtonLink>
        </div>
      </article>
    </main>
  );
};

export const Route = createFileRoute("/(public)/blog/$postId")({
  loader: ({ params }) => fetchBlogPost({ data: { postId: params.postId } }),
  head: ({ loaderData, params }) => {
    const origin = "https://chair-flight.com";
    const title = loaderData?.title ?? "Blog";
    const image = loaderData?.image?.startsWith("/")
      ? `${origin}${loaderData.image}`
      : (loaderData?.image ?? `${origin}/images/social/default.png`);
    return {
      meta: [
        { title: `${title} · Chair Flight` },
        { name: "description", content: loaderData?.description ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "Chair Flight" },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData?.description ?? "" },
        { property: "og:url", content: `${origin}/blog/${params.postId}` },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: loaderData?.description ?? "" },
        { name: "twitter:image", content: image },
      ],
    };
  },
  component: BlogPostPage,
});
