import { useRouter } from "next/router";
import { Box, Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import { AppHead } from "@chair-flight/react/components";
import {
  LayoutModule,
  QuestionEditorAnnexes,
  QuestionEditorExplanation,
  QuestionEditorLearningObjectives,
  QuestionEditorRelatedQuestions,
  QuestionEditorVariant,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type QueryParams = {
  tab?: string;
};

type PageParams = QueryParams & {
  questionBank: QuestionBankName;
  questionId: string;
};

type PageProps = {
  questionBank: QuestionBankName;
  questionId: string;
  tab: string;
};

const Page: NextPage<PageProps> = ({
  questionBank,
  questionId,
  tab: initialTab,
}) => {
  const router = useRouter();
  const query = router.query as PageParams;
  const tab = query.tab ?? initialTab;

  const updateQuery = (query: QueryParams) => {
    router.push(
      { ...router, query: { ...router.query, ...query } },
      undefined,
      { shallow: true },
    );
  };

  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Questions", `/modules/${questionBank}/questions`],
    ["Editor", `/modules/${questionBank}/questions/editor`],
    questionId,
  ] as Breadcrumbs;

  return (
    <LayoutModule
      questionBank={questionBank}
      breadcrumbs={crumbs}
      fixedHeight
      noPadding
    >
      <AppHead
        linkTitle={`Chair Flight [${questionId}]`}
        linkDescription={""}
      />
      <Tabs
        value={tab}
        onChange={(_, v) => updateQuery({ tab: v as string })}
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
          <Tab value={"question"}>Question</Tab>
          <Tab value={"explanation"}>Explanation</Tab>
          <Tab value={"los"}>Learning Objectives</Tab>
          <Tab value={"relatedQs"}>Related Questions</Tab>
          <Tab value={"annexes"}>Annexes</Tab>
        </TabList>
        <Box sx={{ height: (theme) => `calc(${theme.spacing(5)} + 2px)` }} />
        <TabPanel value={"question"} sx={{ flex: 1, overflow: "hidden" }}>
          <QuestionEditorVariant
            noSsr
            questionBank={questionBank}
            questionId={questionId}
          />
        </TabPanel>
        <TabPanel value={"explanation"} sx={{ flex: 1, overflow: "hidden" }}>
          <QuestionEditorExplanation
            noSsr
            questionBank={questionBank}
            questionId={questionId}
          />
        </TabPanel>
        <TabPanel value={"los"} sx={{ flex: 1, overflow: "hidden" }}>
          <QuestionEditorLearningObjectives
            noSsr
            questionBank={questionBank}
            questionId={questionId}
          />
        </TabPanel>
        <TabPanel value={"relatedQs"} sx={{ flex: 1, overflow: "hidden" }}>
          <QuestionEditorRelatedQuestions
            noSsr
            questionBank={questionBank}
            questionId={questionId}
          />
        </TabPanel>
        <TabPanel value={"annexes"} sx={{ flex: 1, overflow: "hidden" }}>
          <QuestionEditorAnnexes
            noSsr
            questionBank={questionBank}
            questionId={questionId}
          />
        </TabPanel>
      </Tabs>
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ params, helper, context }) => {
    const tab = (context.query?.["tab"] ?? "question") as string;
    const allParams = { ...params, tab };

    await Promise.all([
      LayoutModule.getData({ params: allParams, helper }),
      QuestionEditorVariant.getData({ params: allParams, helper }),
      QuestionEditorExplanation.getData({ params: allParams, helper }),
      QuestionEditorLearningObjectives.getData({ params: allParams, helper }),
      QuestionEditorRelatedQuestions.getData({ params: allParams, helper }),
      QuestionEditorAnnexes.getData({ params: allParams, helper }),
    ]);

    return { props: allParams };
  },
);

export default Page;
