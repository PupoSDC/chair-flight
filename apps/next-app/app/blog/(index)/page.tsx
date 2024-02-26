import Link from "next/link";
import * as fs from "node:fs/promises";
import { DateTime } from "luxon";
import { Blog } from "@cf/providers/blog";
import type { FunctionComponent } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { cntl } from "@cf/base/utils";


const BlogIndex: FunctionComponent = async () => {
  const blog = Blog.get();
  await blog.preloadForStaticRender(fs);

  const allPosts = await blog.getAllPosts();
  const meta = allPosts.map(({ content, ...meta }) => meta);

  return (
    <>
      <div
        className={cntl` 
          py-4
          px-1
          min-h-[calc(100vh_-_var(--header-height))] 
          flex flex-col justify-center
          bg-gradient-to-b from-transparent to-primary-300
          dark:bg-gradient-to-b dark:from-transparent dark:to-primary-950
        `}
      >
        <div>
          <h1 className="text-center text-primary-500 text-lg">
            Blog
          </h1>
          <p className="text-center sm:text-2xl text-lg font-semibold">
            Keep up to date with everything <br />
            that is new with Chair Flight
          </p>

          <div
            className={cntl`
              flex 
              flex-col
              gap-4
              max-w-screen-lg 
              mx-auto 
              p-2
              sm:py-8 
              sm:px-4 
              lg:px-0
              lg:flex-row
            `}
          >
            {meta.slice(0, 2).map((post) => (
              <div
                key={post.filename}
                className={cntl`
                  flex-1
                  flex
                  flex-col
                  border
                  rounded-lg
                  backdrop-blur
                  p-2 
                  sm:p-4       

                  bg-opacity-40 
                  bg-zinc-50
                  border-neutral-200 

                  dark:bg-opacity-20
                  dark:bg-zinc-700
                  dark:border-neutral-700
                `}
              >
                <h2
                  children={post.title}
                  className="text-primary-400 text-lg"
                />
                <p
                  children={post.description}
                  className="text-sm flex-1"
                />
                <div className="flex flex-row justify-between mt-4 items-center">
                  <div className="[&>*]:text-xs">
                    <p>
                      {post.author}
                    </p>
                    <p>
                      {DateTime.fromISO(post.date).toFormat("dd LLL yyyy")}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post.filename}`}
                    className="text-primary-400 text-sm flex gap-1 items-center"
                  >
                    <span>Read More</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div
            className={cntl`
              hidden
              sm:flex
              pt-16
              flex-col
              items-center
              animate-bounce
              text-primary-400
            `}
          >
            <p>More Posts</p>
            <ChevronDownIcon className="w-6 h-6" />
          </div>
        </div>
      </div >

      <div
        className={cntl`
          gap-2 
          flex 
          flex-col 
          max-w-screen-md 
          w-full 
          mx-auto 
          p-2
          sm:p-8
        `}
      >
        {meta.map((post) => (
          <div
            key={post.filename}
            className={cntl`
              border
              rounded-sm
              border-neutral-200 dark:border-neutral-700
              p-2 sm:p-4
              bg-neutral-100 dark:bg-neutral-900
            `}
          >
            <h2
              children={post.title}
              className="text-primary-400 text-lg"
            />
            <p
              children={post.description}
              className="text-sm"
            />
            <div className="flex flex-row justify-between mt-4">
              <div className="[&>*]:text-xs">
                <p>
                  {post.author}
                </p>
                <p>
                  {DateTime.fromISO(post.date).toFormat("dd LLL yyyy")}
                </p>
              </div>
              <Link
                href={`/blog/${post.filename}`}
                className="text-primary-300 text-sm flex items-center gap-1"
              >
                <span>Read More</span>
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/**
      {meta.map((post) => (
        <Card sx={{ mt: 2 }} key={post.filename}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <BlogPostChip key={post.tag} tag={post.tag} size="sm" />
            </Box>
            <Typography level="h3" color="primary">
              {post.title}
            </Typography>
            <Typography level="body-sm">{post.description}</Typography>
          </CardContent>
          <CardActions>
            <Box>
              <Typography level="body-sm">{post.author}</Typography>
              <Typography level="body-xs">
                {DateTime.fromISO(post.date).toFormat("dd LLL yyyy")}
              </Typography>
            </Box>
            <Button
              color="primary"
              variant="plain"
              component={Link}
              href={`/blog/${post.filename}`}
              children="Read&nbsp;More"
              endDecorator={<KeyboardArrowRightIcon />}
              sx={{ flex: 0, ml: "auto" }}
            />
          </CardActions>
        </Card>
      ))} */}
    </>
  );
};

export default BlogIndex;
