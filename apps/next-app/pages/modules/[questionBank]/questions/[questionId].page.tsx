import { useRouter } from "next/router";
import { Box, Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import { getRandomId } from "@chair-flight/base/utils";
import {
  LayoutModule,
  QuestionExplanation,
  QuestionMeta,
  QuestionStandAlone,
} from "@chair-flight/next/question-bank";
import { AppHead } from "@chair-flight/react/components";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { Breadcrumbs } from "@chair-flight/next/question-bank";
import type { NextPage } from "next";

type QueryParams = {
  seed?: string;
  tab?: string;
};

type PageParams = QueryParams & {
  questionBank: QuestionBankName;
  questionId: string;
};

type PageProps = {
  questionBank: QuestionBankName;
  questionId: string;
  seed: string;
  tab: string;
};

const Page: NextPage<PageProps> = ({
  questionBank,
  questionId,
  tab: initialTab,
  seed: initialSeed,
}) => {
  const router = useRouter();
  const query = router.query as PageParams;
  const seed = query.seed ?? initialSeed;
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
    questionId,
  ] as Breadcrumbs;

  // const linkDescription = getQuestionPreview(
  //   questionTemplate,
  //   initialVariantId,
  // );

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
        sx={{ backgroundColor: "transparent", flex: 1 }}
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
          <Tab value={"meta"}>Meta</Tab>
        </TabList>
        <Box sx={{ height: (theme) => `calc(${theme.spacing(5)} + 2px)` }} />
        <TabPanel value={"question"}>
          <QuestionStandAlone
            noSsr
            questionId={questionId}
            questionBank={questionBank}
            seed={seed}
            onNavigateToNewSeed={updateQuery}
            sx={{ maxWidth: "md", margin: "auto", width: "100%" }}
          />
        </TabPanel>
        <TabPanel value={"explanation"}>
          <QuestionExplanation
            noSsr
            questionId={questionId}
            questionBank={questionBank}
            sx={{ maxWidth: "md", margin: "auto", width: "100%" }}
          />
        </TabPanel>
        <TabPanel value={"meta"}>
          <QuestionMeta
            noSsr
            questionId={questionId}
            questionBank={questionBank}
            sx={{ maxWidth: "md", margin: "auto", width: "100%" }}
          />
        </TabPanel>
      </Tabs>
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ params, helper, context }) => {
    const seed = (context.query?.["seed"] ?? getRandomId()) as string;
    const tab = (context.query?.["tab"] ?? "question") as string;
    const allParams = { ...params, seed, tab };

    await Promise.all([
      LayoutModule.getData({ params: allParams, helper }),
      QuestionStandAlone.getData({ params: allParams, helper }),
      QuestionExplanation.getData({ params: allParams, helper }),
      QuestionMeta.getData({ params: allParams, helper }),
    ]);

    return { props: allParams };
  },
);

export default Page;
