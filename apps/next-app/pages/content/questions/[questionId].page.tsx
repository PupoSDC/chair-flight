import { default as NextLink } from "next/link";
import { useRouter } from "next/router";
import { default as RefreshIcon } from "@mui/icons-material/Refresh";
import {
  Card,
  CardOverflow,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Link,
  ModalClose,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { getRandomIdGenerator } from "@cf/base/utils";
import { ContentHeader, useMediaQuery, usePageTransition } from "@cf/react/web";
import { ssrHandler } from "@cf/trpc/server";
import { CopyToClipboardButton } from "../../_components/app-buttons";
import { AppHead } from "../../_components/app-head";
import { LayoutPublic } from "../../_components/layout-public";
import { QuestionExplanation } from "../../_containers/question-explanation";
import { QuestionExternalReferences } from "../../_containers/question-external-references";
import { QuestionLearningObjectives } from "../../_containers/question-learning-objectives";
import { QuestionPreview } from "../../_containers/question-preview";
import { QuestionStandalone } from "../../_containers/question-standalone";
import type { NextPage } from "next";

type QueryParams = {
  seed?: string;
  tab?: string;
};

type PageParams = QueryParams & {
  questionId: string;
};

type PageProps = Required<PageParams>;

const Page: NextPage<PageProps> = ({
  questionId,
  tab: initialTab,
  seed: initialSeed,
}) => {
  const router = useRouter();
  const transition = usePageTransition();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

  const query = router.query as QueryParams;
  const seed = query.seed ?? initialSeed;
  const tab = query.tab ?? initialTab;
  const isQuestionTab = tab === "question";

  const nextSeed = getRandomIdGenerator(seed)();

  const explanation = <QuestionExplanation questionId={questionId} />;

  const meta = (
    <Stack sx={{ mt: 2, gap: 2 }}>
      <Card variant="outlined" size="sm">
        <Typography level="h4">Preview</Typography>
        <CardOverflow
          sx={{
            borderBottom: "1px solid",
            borderTop: "1px solid",
            borderColor: "neutral.outlinedBorder",
            backgroundColor: "background.level1",
          }}
        >
          <QuestionPreview questionId={questionId} />
        </CardOverflow>
      </Card>

      <Card variant="outlined" size="sm">
        <Typography level="h4">Learning Objectives</Typography>
        <CardOverflow
          sx={{
            borderBottom: "1px solid",
            borderTop: "1px solid",
            borderColor: "neutral.outlinedBorder",
            backgroundColor: "background.level1",
          }}
        >
          <QuestionLearningObjectives questionId={questionId} />
        </CardOverflow>
      </Card>

      <Card variant="outlined" size="sm">
        <Typography level="h4">External References</Typography>
        <CardOverflow
          sx={{
            borderBottom: "1px solid",
            borderTop: "1px solid",
            borderColor: "neutral.outlinedBorder",
            backgroundColor: "background.level1",
          }}
        >
          <QuestionExternalReferences questionId={questionId} />
        </CardOverflow>
      </Card>
    </Stack>
  );

  const comments = <></>;

  return (
    <LayoutPublic sx={{ main: { maxWidth: "initial" } }}>
      <AppHead
        title={`Chair Flight [${questionId}]`}
        linkTitle={`Chair Flight [${questionId}]`}
      />
      <Stack direction={"row"} maxWidth={isQuestionTab ? "md" : "xl"} mx="auto">
        <Stack sx={{ flex: 1, mx: "auto" }}>
          <ContentHeader
            title={questionId}
            actions={
              <>
                <CopyToClipboardButton
                  url={router.asPath}
                  title={`Share Question`}
                />
                <IconButton
                  sx={{ ml: 0 }}
                  size="sm"
                  component={NextLink}
                  loading={transition.isTransitioning}
                  href={{ query: { ...router.query, seed: nextSeed } }}
                >
                  <RefreshIcon />
                </IconButton>
              </>
            }
            links={
              <>
                <Link
                  replace
                  disabled={tab === "question" || !tab}
                  component={NextLink}
                  href={{ query: { ...router.query, tab: "question" } }}
                  color="neutral"
                  level="body-sm"
                >
                  Question
                </Link>
                <Divider orientation="vertical" />
                <Link
                  replace
                  disabled={tab === "explanation"}
                  component={NextLink}
                  href={{ query: { ...router.query, tab: "explanation" } }}
                  color="neutral"
                  level="body-sm"
                >
                  Explanation
                </Link>
                <Divider orientation="vertical" />
                <Link
                  replace
                  disabled={tab === "meta"}
                  component={NextLink}
                  href={{ query: { ...router.query, tab: "meta" } }}
                  color="neutral"
                  level="body-sm"
                >
                  Meta
                </Link>
                <Divider orientation="vertical" />
                <Link
                  replace
                  disabled={tab === "comments"}
                  component={NextLink}
                  href={{ query: { ...router.query, tab: "comments" } }}
                  color="neutral"
                  level="body-sm"
                >
                  Comments
                </Link>
              </>
            }
          />
          <QuestionStandalone
            sx={{ width: "100%", mt: 2 }}
            questionId={questionId}
            seed={seed}
          />
        </Stack>
        {!isQuestionTab && !isSmall && (
          <Divider orientation="vertical" sx={{ mx: 1 }} />
        )}
        {!isQuestionTab && !isSmall && (
          <Stack sx={{ flex: 1 }}>
            <Typography level="h3" component={"h2"}>
              {tab[0].toLocaleUpperCase() + tab.slice(1)}
            </Typography>
            <Divider />
            {tab === "explanation" && explanation}
            {tab === "meta" && meta}
            {tab === "comments" && comments}
          </Stack>
        )}
      </Stack>
      {isSmall && (
        <Drawer
          open={!isQuestionTab}
          onClose={() =>
            router.replace({ query: { ...router.query, tab: "question" } })
          }
          anchor="bottom"
          size="lg"
        >
          <ModalClose />
          <DialogTitle level="h4" component="h2" sx={{ mt: 1 }}>
            {tab[0].toLocaleUpperCase() + tab.slice(1)}
          </DialogTitle>
          <DialogContent sx={{ px: 2, pb: 2 }}>
            {tab === "explanation" && explanation}
            {tab === "meta" && meta}
            {tab === "comments" && comments}
          </DialogContent>
        </Drawer>
      )}
    </LayoutPublic>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ params, helper, context }) => {
    const id = params.questionId;
    const seed = (context.query?.["seed"] ?? "default") as string;
    const tab = (context.query?.["tab"] ?? "question") as string;
    const allParams = { ...params, seed, tab };

    await helper.questionBank.questions.getStandalone.fetch({
      id,
      seed,
    });

    return { props: allParams };
  },
);

export default Page;
