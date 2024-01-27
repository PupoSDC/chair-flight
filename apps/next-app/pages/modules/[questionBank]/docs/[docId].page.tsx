import * as fs from "node:fs/promises";
import {
  Chip,
  Divider,
  Drawer,
  Link,
  ModalClose,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import {
  AppHead,
  useDisclose,
  useMediaQuery,
} from "@chair-flight/react/components";
import {
  DocContent,
  LayoutModule,
  LearningObjectiveQuestions,
  LearningObjectiveTree,
} from "@chair-flight/react/containers";
import { staticHandler, staticPathsHandler } from "@chair-flight/trpc/server";
import type {
  LearningObjectiveId,
  QuestionBankName,
} from "@chair-flight/base/types";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type PageProps = {
  docId: string;
  questionBank: QuestionBankName;
  learningObjectiveId: LearningObjectiveId;
  title: string;
  description: string;
  parent: null | {
    title: string;
    href: string;
  };
};

type PageParams = {
  docId: string;
  questionBank: QuestionBankName;
};

export const Page: NextPage<PageProps> = ({
  docId,
  questionBank,
  learningObjectiveId,
  title,
  description,
  parent,
}) => {
  const theme = useTheme();
  const loDrawer = useDisclose(false);
  const questionDrawer = useDisclose(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Docs", `/modules/${questionBank}/docs`],
    docId,
  ] as Breadcrumbs;

  return (
    <LayoutModule questionBank={questionBank} breadcrumbs={crumbs}>
      <AppHead title={title} linkTitle={title} linkDescription={description} />
      <Stack
        sx={{
          width: "100%",
          maxWidth: "md",
          margin: "auto",
        }}
      >
        {parent && <Link href={parent.href} children={parent.title} />}
        <Typography
          level="h3"
          component="h1"
          sx={{ fontWeight: "bold" }}
          children={title}
        />

        <Divider sx={{ width: "100%", mb: 1 }} />

        <Stack
          spacing={1}
          width={"100%"}
          marginBottom={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start" }}
        >
          <Chip color="primary" onClick={loDrawer.open}>
            Learning Objectives
          </Chip>
          <Chip color="primary" onClick={questionDrawer.open}>
            Questions
          </Chip>
        </Stack>

        <DocContent docId={docId} questionBank={questionBank} />

        <Drawer
          anchor="right"
          size="md"
          open={loDrawer.isOpen}
          onClose={loDrawer.close}
        >
          {isMobile && <ModalClose />}
          <Typography level="h3" sx={{ m: 1, mt: 1.5 }}>
            Learning Objectives
          </Typography>
          <LearningObjectiveTree
            questionBank={questionBank}
            learningObjectiveId={learningObjectiveId}
            forceMode="mobile"
            sx={{
              flex: 1,
              border: "none",
              overflowY: "scroll",
            }}
          />
        </Drawer>

        <Drawer
          anchor="right"
          size="md"
          open={questionDrawer.isOpen}
          onClose={questionDrawer.close}
        >
          {isMobile && <ModalClose />}
          <Typography level="h3" sx={{ m: 1, mt: 1.5 }}>
            Questions
          </Typography>
          <LearningObjectiveQuestions
            questionBank={questionBank}
            learningObjectiveId={learningObjectiveId}
            forceMode="mobile"
            sx={{
              flex: 1,
              border: "none",
              overflowY: "scroll",
            }}
          />
        </Drawer>
      </Stack>
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    const { doc } = await helper.questionBankDocs.getDoc.fetch(params);
    const props = {
      ...params,
      learningObjectiveId: doc.learningObjective,
      title: doc.title,
      description: doc.description,
      parent: doc.parent,
    };

    await LayoutModule.getData({ helper, params });
    await DocContent.getData({ helper, params });
    await LearningObjectiveTree.getData({ helper, params: props });
    return { props };
  },
  fs,
);

export const getStaticPaths = staticPathsHandler<PageParams>(
  async ({ helper }) => {
    const qbDocs = helper.questionBankDocs;
    const { paths } = await qbDocs.getAllDocPaths.fetch();
    return { fallback: false, paths };
  },
  fs,
);

export default Page;
