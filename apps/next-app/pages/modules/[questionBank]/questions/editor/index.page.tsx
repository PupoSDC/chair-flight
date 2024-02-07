import * as fs from "node:fs/promises";
import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, QuestionEditorDiffTool, QuestionManager } from "@chair-flight/react/containers";
import { staticHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { GetStaticPaths, NextPage } from "next";
import { Box, Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";

type PageProps = {
  questionBank: QuestionBankName;
};

type PageParams = {
  questionBank: QuestionBankName;
};

const Page: NextPage<PageProps> = ({ questionBank }) => {
  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Questions", `/modules/${questionBank}/questions`],
    "Editor",
  ] as Breadcrumbs;

  

  return (
    <LayoutModule
      questionBank={questionBank}
      breadcrumbs={crumbs}
      fixedHeight
      noPadding
    >
      <AppHead />
      <Tabs
        sx={{
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <TabList
          sx={{
            position: "fixed",
            bgcolor: "background.surface",
            width: "100%",
            height: (theme) => `calc(${theme.spacing(5)} + 2px)`,

            [`& .${tabClasses.selected}`]: {
              color: "primary.plainColor",
            },
          }}
        >
          <Tab value={"Intro"}>Intro</Tab>
          <Tab value={"Pick"}>Pick Questions</Tab>
          <Tab value={"Edit"}>Edit Questions</Tab>
          <Tab value={"Submit"}>Submit Changes</Tab>
        </TabList>
        <Box sx={{ height: (theme) => `calc(${theme.spacing(5)} + 2px)` }} />
        <TabPanel value={"Pick"} sx={{ flex: 1, overflow: "hidden" }}>
          <QuestionManager 
            noSsr
            questionBank={questionBank} 
            sx={{ height: "100%" }} 
          />
        </TabPanel>
        <TabPanel value={"Edit"} sx={{ flex: 1, overflow: "hidden" }}>
          <QuestionEditorDiffTool 
            noSsr
            questionBank={questionBank} 
            sx={{ height: "100%" }} 
          />
        </TabPanel>
      </Tabs>
      
    </LayoutModule>
  );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
  async ({ params, helper }) => {
    await LayoutModule.getData({ helper, params });
    await QuestionManager.getData({ helper, params });
    return { props: params };
  },
  fs,
);

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const banks: QuestionBankName[] = ["type", "atpl"];
  const paths = banks.map((questionBank) => ({ params: { questionBank } }));
  return { fallback: false, paths };
};

export default Page;
