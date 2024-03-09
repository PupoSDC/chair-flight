import { Link, Stack, Typography } from "@mui/joy";
import { MdxRemote } from "@cf/next/ui";
import { Github } from "@cf/providers/github";
import { QuestionBank } from "@cf/providers/question-bank";
import { Ups } from "@cf/react/ui";
import type { DocId, QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type Props = {
  params: {
    docId: DocId;
    questionBank: QuestionBankName;
  };
};

const Page: FunctionComponent<Props> = async ({ params }) => {
  const questionBank = new QuestionBank(params.questionBank);
  const github = new Github();
  const doc = await questionBank.getOne("docs", params.docId);

  const repoUrl = github.getRepositoryUrl();

  const links = {
    search: `/${params.questionBank}/docs`,
    aboutUs: "/blog/000-about-us",
    blog: "/blog",
    github: `${repoUrl}/blob/main/${doc.fileName}`,
  };

  return (
    <Stack sx={{ flex: 1 }}>
      {doc.empty ? (
        <Ups
          message="This Doc has not been written yet."
          children={
            <>
              <Typography level="body-lg">
                You can help chair flight grow by contributing to it!
              </Typography>
              <Link href={links.github} level="body-sm">
                Edit this page on Github
              </Link>
            </>
          }
        />
      ) : (
        <MdxRemote source={doc.content} />
      )}
    </Stack>
  );
};

export default Page;
