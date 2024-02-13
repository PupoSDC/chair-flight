import { default as RightArrow } from "@mui/icons-material/ChevronRightOutlined";
import {
  Divider,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  tabClasses,
  tabPanelClasses,
} from "@mui/joy";
import {
  LayoutModule,
  QuestionEditorAnnexes,
  QuestionEditorCode,
  QuestionEditorExplanation,
  QuestionEditorLearningObjectives,
  QuestionEditorPreview,
  QuestionEditorRelatedQuestions,
  QuestionEditorVariant,
} from "@cf/next/question-bank";
import { AppHead } from "@cf/react/components";
import { ssrHandler } from "@cf/trpc/server";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { Breadcrumbs } from "@cf/next/question-bank";
import type { NextPage } from "next";

type PageParams = {
  questionBank: QuestionBankName;
  questionId: string;
};

type PageProps = {
  questionBank: QuestionBankName;
  questionId: string;
};

const Page: NextPage<PageProps> = ({ questionBank, questionId }) => {
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
      sx={{ flexDirection: "row" }}
    >
      <AppHead
        linkTitle={`Chair Flight [${questionId}]`}
        linkDescription={""}
      />

      <Tabs
        defaultValue={"question"}
        sx={{
          pl: 1,
          flex: 1,
          background: "transparent",

          [`& .${tabPanelClasses.root}`]: {
            flex: 1,
            overflow: "hidden",
            py: 1,
          },

          [`& .${tabClasses.selected}`]: {
            color: "primary.plainColor",
            background: "transparent",
          },
        }}
      >
        <TabList sx={{ justifyContent: "center" }}>
          <Tab value={"question"}>Question</Tab>
          <Tab value={"explanation"}>Explanation</Tab>
          <Tab value={"los"}>LOs</Tab>
          <Tab value={"annexes"}>Annexes</Tab>
          <Tab value={"relatedQs"}>Related</Tab>
          <Tab value={"code"}>Code</Tab>
        </TabList>
        <TabPanel value={"question"} sx={{ px: 0, borderRadius: 4 }}>
          <QuestionEditorVariant
            noSsr
            questionBank={questionBank}
            questionId={questionId}
            sx={{ height: "100%", overflow: "auto" }}
          />
        </TabPanel>
        <TabPanel value={"explanation"} sx={{ px: 0, borderRadius: 4 }}>
          <QuestionEditorExplanation
            noSsr
            questionBank={questionBank}
            questionId={questionId}
          />
        </TabPanel>
        <TabPanel value={"annexes"} sx={{ px: 0 }}>
          <QuestionEditorAnnexes
            noSsr
            questionBank={questionBank}
            questionId={questionId}
            sx={{ height: "100%" }}
          />
        </TabPanel>
        <TabPanel value={"los"} sx={{ px: 0 }}>
          <QuestionEditorLearningObjectives
            noSsr
            questionBank={questionBank}
            questionId={questionId}
            sx={{ height: "100%" }}
          />
        </TabPanel>
        <TabPanel value={"relatedQs"} sx={{ px: 0 }}>
          <QuestionEditorRelatedQuestions
            noSsr
            questionBank={questionBank}
            questionId={questionId}
            sx={{ height: "100%" }}
          />
        </TabPanel>
        <TabPanel value={"code"} sx={{ px: 0, borderRadius: 4 }}>
          <QuestionEditorCode
            noSsr
            questionBank={questionBank}
            questionId={questionId}
          />
        </TabPanel>
      </Tabs>
      <Divider orientation="vertical">
        <RightArrow size="lg" />
      </Divider>
      <QuestionEditorPreview
        questionBank={questionBank}
        questionId={questionId}
        sx={{ flex: 1, overflow: "hidden", height: "100%", pr: 1 }}
      />
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
