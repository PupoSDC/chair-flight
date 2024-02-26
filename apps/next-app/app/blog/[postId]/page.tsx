import { default as Link } from "next/link";
import * as fs from "node:fs/promises";
import { DateTime } from "luxon";
import { Blog } from "@cf/providers/blog";
import type { FunctionComponent } from "react";
import { ChevronRightIcon, ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/24/outline"
import { cntl } from "@cf/base/utils";
import { MdxRemote } from "@cf/react/ui";


type BlogPostProps = {
  params: { postId: string }
};

const BlogPost: FunctionComponent<BlogPostProps> = async ({ params }) => {
  const blog = Blog.get();
  await blog.preloadForStaticRender(fs);

  const meta = await blog.getPost(params.postId);
  const MATCH_CODE_BLOCKS = /```tsx eval((?:.|\n)*?)```/g;
  const content = meta.content.replaceAll(MATCH_CODE_BLOCKS, "$1");

  const post = {

    title: meta.title,
    description: meta.description,
    tag: meta.tag,
    date: meta.date,
    tagHref: `/blog?tag=${meta.tag}`,
  };

  return (
    <>
    <div 
      className={cntl`
        bg-[url(/images/background/article.png)]
        fixed
        left-0
        top-[var(--header-height)]
        right-0
        bottom-0
        width-full
        height-full
        bg-cover
        opacity-10
      `}
    />
      <main className="mx-auto w-full max-w-screen-md px-2 py-4">
        <div className="flex justify-between">
          <Link
            href="/blog"
            className="flex mr-auto pb-2 text-primary-400 text-sm items-center font-semibold"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            <span>Back to blog</span>
          </Link>
          <p className="text-sm">
            {DateTime.fromISO(post.date).toFormat("dd LLL yyyy")}
          </p>
        </div>


        <h1 className="border-b mb-4">
          {post.title}
        </h1>


        <MdxRemote
          source={content}
          className=""
          components={{

          }}
        />
      </main>
    </>
  );
};

export default BlogPost;
