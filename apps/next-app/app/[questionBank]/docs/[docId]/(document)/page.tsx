import { Chip, Divider, Drawer, Link, Stack, Typography } from "@mui/joy";
import { markdownPlugins } from "@cf/core/markdown";
import { Github } from "@cf/providers/github";
import { QuestionBank } from "@cf/providers/question-bank";
import { markdownComponents } from "@cf/react/markdown";
import { ModulesMain } from "../../../_client/modules-main";
import type { DocId, QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";
import { MdxRemote } from "@cf/react/containers";
import { DocLearningObjectives } from "../(details)/learning-objectives/doc-learning-objectives";

type PageParams = {
  questionBank: QuestionBankName;
  docId: DocId;
};

type PageProps = {
  params: {
    questionBank: QuestionBankName;
    docId: DocId;
  };
  searchParams: {
    drawer?: "learning-objectives" | "questions";
  }
}

const getData = async (params: PageParams) => {
  const github = Github.get();
  const repoUrl = github.getRepositoryUrl();
  const bank = QuestionBank.get(params.questionBank);
  const rawDoc = await bank.getOne("docs", params.docId);
  const children = await bank.getSome("docs", rawDoc.docs);
  const MATCH_CODE_BLOCKS = /```tsx eval((?:.|\n)*?)```/g;
  const parent = rawDoc.parentId
    ? await bank.getOne("docs", rawDoc.parentId)
    : undefined;

  const doc = {
    title: `[${rawDoc.id}] ${rawDoc.title}`,
    content: rawDoc.content.replaceAll(MATCH_CODE_BLOCKS, "$1"),
    isEmpty: rawDoc.empty,
    parent: parent
      ? {
          href: `/modules/${params.questionBank}/docs/${parent.id}`,
          title: `[${parent.id}] ${parent.title}`,
        }
      : null,
    children: children.map((child) => ({
      href: `/modules/${params.questionBank}/docs/${child.id}`,
      title: `[${child.id}] ${child.title}`,
      isEmpty: child.empty,
    })),
    links: {
      search: `/modules/${params.questionBank}/docs`,
      aboutUs: "/blog/000-about-us",
      blog: "/blog",
      github: `${repoUrl}/blob/main/${rawDoc.fileName}`,
    },
  };
  return { doc };
};

const Page: FunctionComponent<PageProps> = async ({ params, searchParams }) => {
  const { doc } = await getData(params);
  return (
    <ModulesMain>
      <Stack sx={{ maxWidth: "md", mx: "auto" }}>
        {doc.parent && (
          <Link href={doc.parent.href} children={doc.parent.title} />
        )}
        <Typography
          level="h3"
          component="h1"
          sx={{ fontWeight: "bold" }}
          children={doc.title}
        />

        <Divider sx={{ width: "100%", my: 1 }} />

        <Stack
          spacing={1}
          width={"100%"}
          marginBottom={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start" }}
        >
          <Chip color="primary" href="?drawer=learning-objectives" component={Link}>
            Learning Objectives
          </Chip>
          <Chip color="primary" href="?drawer=questions" component={Link}>
            Questions
          </Chip>
        </Stack> 
        
        <MdxRemote
          source={doc.content}
          components={{
            ...markdownComponents,
          }}
          {...markdownPlugins}
        />

        <Drawer open={searchParams.drawer === "learning-objectives"}>
          <DocLearningObjectives {...params} currentCourse="all" />
        </Drawer>
      </Stack>
    </ModulesMain>
  );
};

export default Page;
