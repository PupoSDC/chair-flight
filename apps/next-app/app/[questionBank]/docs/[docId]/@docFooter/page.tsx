import { Divider, Link, Stack, Typography } from "@mui/joy";
import { Github } from "@cf/providers/github";
import { QuestionBank } from "@cf/providers/question-bank";
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
    <>
      <Divider sx={{ mt: 4, mb: 2 }} />
      <Typography level="body-sm">
        Text is available under the MIT License.
      </Typography>
      <Stack direction={"row"} gap={2} mt={2} mb={4}>
        <Link href={links.github} level="body-sm" target="_blank">
          Edit this page on Github
        </Link>
        <Link href={links.search} level="body-sm">
          Search
        </Link>
        <Link href={links.blog} level="body-sm">
          Blog
        </Link>
        <Link href={links.aboutUs} level="body-sm">
          About Chair Flight
        </Link>
      </Stack>
    </>
  );
};

export default Page;
