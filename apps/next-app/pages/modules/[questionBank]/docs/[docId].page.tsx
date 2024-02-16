import * as fs from "node:fs/promises";
import { Drawer, ModalClose, Typography, useTheme } from "@mui/joy";
import { DocContent, LayoutModule } from "@cf/next/question-bank";
import { useDisclose, useMediaQuery } from "@cf/react/components";
import { staticHandler, staticPathsHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { Breadcrumbs } from "@cf/next/question-bank";
import type { NextPage } from "next";

type PageProps = {
  docId: string;
  questionBank: QuestionBankName;
};

type PageParams = {
  docId: string;
  questionBank: QuestionBankName;
};

export const Page: NextPage<PageProps> = ({ docId, questionBank }) => {
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
      <DocContent
        onLearningObjectivesOpen={loDrawer.open}
        onQuestionsOpen={questionDrawer.open}
        docId={docId}
        questionBank={questionBank}
        sx={{ width: "100%", maxWidth: "md", margin: "auto" }}
      />

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
      </Drawer>
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ helper, params });
    await DocContent.getData({ helper, params });
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
