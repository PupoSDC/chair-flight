import * as fs from "node:fs/promises";
import { Typography, Box } from "@mui/joy";
import { AppHead } from "@chair-flight/react/components";
import {
  FlashcardCollectionList,
  LayoutModule,
} from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { Breadcrumbs } from "@chair-flight/react/containers";
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
    <LayoutModule noPadding questionBank={questionBank} breadcrumbs={crumbs}>
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
      <Box component="section" maxWidth="lg" margin="auto" p={2}>
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
      </Box>
      <FlashcardCollectionList questionBank={questionBank} />
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
