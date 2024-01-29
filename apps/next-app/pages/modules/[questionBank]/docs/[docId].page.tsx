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
import { trpc } from "@chair-flight/trpc/client";
import { staticHandler, staticPathsHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type PageProps = {
  docId: string;
  questionBank: QuestionBankName;
};

type PageParams = {
  docId: string;
  questionBank: QuestionBankName;
};

const useDoc = trpc.containers.docs.getDoc.useSuspenseQuery;

export const Page: NextPage<PageProps> = ({ docId, questionBank }) => {
  const [{ doc }] = useDoc({ docId, questionBank });
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
      <AppHead
        title={doc.title}
        linkTitle={doc.title}
        linkDescription={doc.description}
      />
      <Stack
        sx={{
          width: "100%",
          maxWidth: "md",
          margin: "auto",
        }}
      >
        {doc.parent && (
          <Link href={doc.parent.href} children={doc.parent.title} />
        )}
        <Typography
          level="h3"
          component="h1"
          sx={{ fontWeight: "bold" }}
          children={doc.title}
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
            learningObjectiveId={doc.learningObjective}
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
            learningObjectiveId={doc.learningObjective}
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
  async ({ params: rawParams, helper }) => {
    const data = await helper.containers.docs.getDoc.fetch(rawParams);
    const learningObjectiveId = data.doc.learningObjective;
    const params = { ...rawParams, learningObjectiveId };
    await LayoutModule.getData({ helper, params });
    await DocContent.getData({ helper, params });
    await LearningObjectiveTree.getData({ helper, params });
    return { props: params };
  },
  fs,
);

export const getStaticPaths = staticPathsHandler<PageParams>(
  async ({ helper }) => {
    const pageGeneration = helper.pageGeneration.modules;
    const { paths } = await pageGeneration.getDocGenerationPaths.fetch();
    return { fallback: false, paths };
  },
  fs,
);

export default Page;
