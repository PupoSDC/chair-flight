import { Box, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import { AppHead, LayoutPublic } from "@cf/next/public";
import { Blog } from "@cf/providers/content";
import { BackgroundFadedImage, BlogPostCard } from "@cf/react/web";
import type { BlogPostCardProps } from "@cf/react/web";
import type { GetStaticProps, NextPage } from "next";

type PageProps = {
  posts: BlogPostCardProps[];
};

const Page: NextPage<PageProps> = ({ posts }) => {
  return (
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <AppHead />
      <Typography level="h2" sx={{ pt: 4 }}>
        Posts
      </Typography>
      {posts.map((post) => (
        <BlogPostCard {...post} key={post.href} sx={{ mt: 2 }} />
      ))}
      <Box component="footer" sx={{ py: 2 }} />
    </LayoutPublic>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const blog = new Blog();
  const data = await blog.getBlogPosts();
  const posts = data.posts.map((post) => ({
    tag: post.tag,
    title: post.title,
    description: post.description,
    author: post.author,
    date: DateTime.fromJSDate(post.createdAt).toFormat("dd LLL yyyy"),
    href: `/blog/${post.id}`,
  }));
  return { props: { posts } };
};

export default Page;
