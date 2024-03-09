import { default as Link } from "next/link";
import { Box, Stack, Typography } from "@mui/joy";
import { DateTime } from "luxon";
import { LatestTests } from "@cf/next/tests";
import { ModulesMain } from "@cf/next/ui";
import { Blog } from "@cf/providers/blog";
import { QuestionBank } from "@cf/providers/question-bank";
import { BlogCard, ModuleCard } from "@cf/react/ui";
import { default as previewAtpl } from "./images/atpl.png";
import { default as previewB737 } from "./images/b737.png";
import { default as previewPrep } from "./images/prep.png";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type PageProps = {
  params: {
    questionBank: QuestionBankName;
  };
};

const Page: FunctionComponent<PageProps> = async ({ params }) => {
  const blog = new Blog();
  const atpl = new QuestionBank("atpl");
  const type = new QuestionBank("type");
  const prep = new QuestionBank("prep");
  const allPosts = await blog.getAllPosts();
  const numberOfFlashcards = await prep
    .getAll("flashcards")
    .then((c) => c.length);
  const numberOfAtplQuestions = await atpl
    .getAll("questions")
    .then((c) => c.length);
  const numberOfTypeQuestions = await type
    .getAll("questions")
    .then((c) => c.length);

  const blogPosts = allPosts.slice(0, 5).map(({ content, ...meta }) => ({
    ...meta,
    description: content.slice(0, 200),
    date: DateTime.fromISO(meta.date).toFormat("dd LLL yyyy"),
    href: `/blog/${meta.filename}`,
  }));

  const modules = [
    {
      id: "atpl" satisfies QuestionBankName,
      title: "EASA ATPL Theory",
      imgSrc: previewAtpl,
      imgAlt: "A cessna looking cute in the skies",
      description: `${numberOfAtplQuestions} Questions`,
      href: `/atpl/home`,
    },
    {
      id: "type" satisfies QuestionBankName,
      title: "Type Rating B737 + A320",
      imgSrc: previewB737,
      imgAlt: "737 dragging itself through the skies like an old lady",
      description: `${numberOfTypeQuestions} Questions`,
      href: "/type/home",
    },
    {
      id: "prep" satisfies QuestionBankName,
      title: "Interview Preparation",
      imgSrc: previewPrep,
      imgAlt: "F16, almost no one using this website will ever fly.",
      description: `${numberOfFlashcards} Flashcards`,
      href: "/prep/home",
    },
  ];

  const modulesBlock = (
    <Stack spacing={{ xs: 0.5, md: 1 }} direction={{ lg: "row" }}>
      {modules.map((mod) => (
        <ModuleCard
          {...mod}
          key={mod.id}
          selected={mod.id === params.questionBank}
          sx={{ flex: 1 }}
          component={Link}
          replace
        />
      ))}
    </Stack>
  );

  const blogPostsBlock = (
    <Stack spacing={{ xs: 0.5, md: 1 }}>
      {blogPosts.map((post) => (
        <BlogCard
          {...post}
          key={post.href}
          imageUrl={post.imageUrl ?? undefined}
        />
      ))}
    </Stack>
  );

  return (
    <ModulesMain
      sx={{
        flexDirection: { xs: "column", lg: "row" },
        gap: { xs: 0.5, md: 2 },
      }}
    >
      <Stack sx={{ flex: { xs: 1, xl: 2 }, gap: { xs: 0.5, md: 2 } }}>
        <Box>
          <Typography level="h3">Modules</Typography>
          {modulesBlock}
        </Box>
        <Box>
          <Typography level="h3">Latest Tests</Typography>
          <LatestTests questionBank={params.questionBank} />
        </Box>
      </Stack>

      <Stack sx={{ flex: 1, minWidth: { lg: 320 } }}>
        <Typography level="h3">Latest Blog Posts</Typography>
        {blogPostsBlock}
      </Stack>
    </ModulesMain>
  );
};

export default Page;
