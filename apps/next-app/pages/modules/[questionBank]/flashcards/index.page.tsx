import * as fs from "node:fs/promises";
import { Typography, Box } from "@mui/joy";
import { AppHead } from "@cf/next/public";
import { FlashcardCollectionList, LayoutModule } from "@cf/next/question-bank";
import { staticHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { Breadcrumbs } from "@cf/next/question-bank";
import type { GetStaticPaths, NextPage } from "next";

type PageParams = {
  questionBank: QuestionBankName;
};

type PageProps = {
  questionBank: QuestionBankName;
};

const Page: NextPage<PageProps> = ({ questionBank }) => {
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    "Flashcards",
  ] as Breadcrumbs;

  return (
    <LayoutModule questionBank={questionBank} breadcrumbs={crumbs}>
      <AppHead
        title="Chair Flight - Flash Cards"
        linkTitle="Chair Flight - Flash Cards"
        linkDescription={[
          "Use these flash cards to practice for your interview. You can review",
          "all flash cards at once, or get 10 random cards to review. Try to",
          "answer the question outloud as you would in an interview. Consider",
          "recording your answer and playing it back to see how you sound.",
          "\n\n",
          "Once you are satisfied with the answer, Flip the card to see if you",
          "are close enough.",
        ].join(" ")}
      />
      <Box component="section" maxWidth="lg" margin="auto">
        <Typography level="h1">Flash Cards</Typography>
        <Typography>
          Practice for open-ended interview questions.
          <br />
          Use these flash cards to practice for your interview. You can review
          all flash cards at once, or get 10 random cards to review. Try to
          answer the question outloud as you would in an interview. Consider
          recording your answer and playing it back to see how you sound.
          <br />
          Once you are satisfied with the answer, Flip the card to see if you
          are close enough.
        </Typography>
        <Typography level="h3" sx={{ mt: 3, color: "primary.500" }}>
          Have fun!
        </Typography>
        <FlashcardCollectionList sx={{ mt: 2 }} questionBank={questionBank} />
      </Box>
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ helper, params });
    await FlashcardCollectionList.getData({ helper, params });
    return { props: params };
  },
  fs,
);

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const banks: QuestionBankName[] = ["prep"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default Page;
