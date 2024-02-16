import * as fs from "node:fs/promises";
import { Drawer, ModalClose, Typography, useTheme } from "@mui/joy";
import { AppHead } from "@cf/next/public";
import {
  DocContent,
  DocLearningObjectives,
  DocQuestions,
  LayoutModule,
} from "@cf/next/question-bank";
import { useDisclose, useMediaQuery } from "@cf/react/components";
import { staticHandler, staticPathsHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { AppHeadProps } from "@cf/next/public";
import type { Breadcrumbs } from "@cf/next/question-bank";
import type { NextPage } from "next";

const HEADER_HEIGHT = 48;

type PageProps = {
  docId: string;
  questionBank: QuestionBankName;
  meta: AppHeadProps;
};

type PageParams = {
  docId: string;
  questionBank: QuestionBankName;
};

export const Page: NextPage<PageProps> = ({ docId, questionBank, meta }) => {
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
      <AppHead {...meta} />
      <DocContent
        onLearningObjectivesOpen={loDrawer.open}
        onQuestionsOpen={questionDrawer.open}
        docId={docId}
        questionBank={questionBank}
        sx={{
          width: "100%",
          maxWidth: "md",
          margin: "auto",
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px - 32px)`,
        }}
      />

      <Drawer
        anchor="right"
        size="lg"
        open={loDrawer.isOpen}
        onClose={loDrawer.close}
      >
        {isMobile && <ModalClose />}
        <Typography level="h3" sx={{ m: 1, mt: 1.5 }}>
          Learning Objectives
        </Typography>
        <DocLearningObjectives
          noSsr
          docId={docId}
          questionBank={questionBank}
          sx={{ mx: 2 }}
        />
      </Drawer>

      <Drawer
        anchor="right"
        size="lg"
        open={questionDrawer.isOpen}
        onClose={questionDrawer.close}
      >
        {isMobile && <ModalClose />}
        <Typography level="h3" sx={{ m: 1, mt: 1.5 }}>
          Questions
        </Typography>
        <DocQuestions
          noSsr
          docId={docId}
          questionBank={questionBank}
          sx={{ mx: 2 }}
        />
      </Drawer>
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ helper, params });
    await DocContent.getData({ helper, params });
    const { doc } = await helper.common.docs.getDoc.fetch(params);
    const meta: AppHeadProps = {
      title: doc.title,
      linkTitle: `Chair FLight: ${doc.title}`,
    };

    return { props: { ...params, meta } };
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
