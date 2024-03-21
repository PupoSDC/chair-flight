import { Box, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import { AppHead, LayoutPublic } from "@cf/next/public";
import { Github } from "@cf/providers/github";
import { BackgroundFadedImage, BlogPostCard } from "@cf/react/components";
import type { BlogPostCardProps } from "@cf/react/components";
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
  const github = new Github();
  const data = await github.getBlogPosts();
  const posts = data.posts.map((post) => ({
    tag: post.tag,
    title: post.title,
    description: post.description,
    author: post.author,
    date: DateTime.fromJSDate(post.date).toFormat("dd LLL yyyy"),
    href: `/blog/${post.id}`,
  }));
  return { props: { posts } };
};

export default Page;
