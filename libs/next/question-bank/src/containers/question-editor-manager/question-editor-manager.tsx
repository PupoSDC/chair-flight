import { default as GithubIcon } from "@mui/icons-material/GitHub";
import { default as AddInput } from "@mui/icons-material/InputOutlined";
import {
  Button,
  Divider,
  Link,
  ListItemContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { type QuestionBankName } from "@cf/core/question-bank";
import { Markdown } from "@cf/react/markdown";
import { LoadingButton, SearchHeader, SearchList } from "@cf/react/ui";
import { trpc, type AppRouterOutput } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import { VerticalDivider } from "../../components/vertical-divider";
import { useQuestionEditor } from "../../hooks/use-question-editor";
import { useQuestionSearch } from "../../hooks/use-question-search";
import { QuestionManagerEditorListItem } from "./question-editor-manager-list-item";
import type { QuestionTemplateId } from "@cf/core/question-bank";

type Props = {
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorManager"];

type FilterKeys = keyof Data["filters"];

export const QuestionEditorManager = container<Props, Params, Data>(
  ({ sx, component = "div", questionBank }) => {
    const utils = trpc.useUtils();
    const serverData = QuestionEditorManager.useData({ questionBank });
    const search = useQuestionSearch({ questionBank });

    const { items, hasDiff, addQuestionToEditor, isQuestionInEditor } =
      useQuestionEditor((s) => ({
        items: Object.keys(s[questionBank].afterState).reverse(),
        hasDiff: s.getQuestionsWithADiff({ questionBank }).length > 0,
        addQuestionToEditor: s.addQuestion,
        isQuestionInEditor: s.isQuestionInEditor,
      }));

    const addQuestion = (questionId: QuestionTemplateId) => {
      addQuestionToEditor({ trpc: utils, questionBank, questionId });
    };

    return (
      <Stack direction="row" component={component} sx={sx}>
        <Stack height="100%" flex={1}>
          <SearchHeader
            search={search.searchQuery}
            searchPlaceholder="Search Questions..."
            filters={serverData.filters}
            filterValues={search.filterForm.watch()}
            isLoading={search.isLoading}
            isError={search.isError}
            onSearchChange={search.setSearchQuery}
            onFilterValuesChange={(k, v) =>
              search.filterForm.setValue(k as FilterKeys, v)
            }
          />
          <SearchList
            forceMode={"mobile"}
            loading={search.isLoading}
            error={search.isError}
            items={search.items}
            onFetchNextPage={search.fetchNextPage}
            sx={{ flex: 1, overflow: "hidden" }}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={(result) => {
              const questionId = result.id;
              const isEdited = isQuestionInEditor({ questionBank, questionId });

              return (
                <ListItemContent
                  sx={{
                    ...(isEdited && {
                      background: `repeating-linear-gradient(
                            45deg,
                            rgba(0, 0, 0, 0),
                            rgba(0, 0, 0, 0) 10px,
                            rgba(234, 154, 62, 0.3) 10px,
                            rgba(234, 154, 62, 0.3) 20px
                          )`,
                    }),
                  }}
                >
                  <Stack direction={"row"} gap={1} alignItems={"center"}>
                    <Typography level="h5" sx={{ fontSize: "sm", mr: "auto" }}>
                      {result.id}
                    </Typography>
                    {!isEdited && (
                      <Tooltip title={"Add Question, and related questions"}>
                        <LoadingButton
                          sx={{ px: 1 }}
                          size="sm"
                          variant="plain"
                          onClick={() => addQuestion(result.id)}
                          children={<AddInput />}
                        />
                      </Tooltip>
                    )}
                  </Stack>
                  <Typography sx={{ fontSize: "xs", fontWeight: 500 }}>
                    {result.relatedQuestions.map((q) => q.id).join(", ")}
                  </Typography>
                  <Markdown compressed>{result.text}</Markdown>
                  <Divider sx={{ my: 1, mx: 2 }} />
                  <Typography sx={{ fontSize: "xs" }}>
                    <b>Related Questions</b>
                    <br />
                    {result.relatedQuestions.map((q) => q.id).join(", ") ||
                      "None"}
                  </Typography>
                  <Typography sx={{ fontSize: "xs" }}>
                    <b>Learning Objectives</b>
                    <br />
                    {result.learningObjectives.map((q) => q.id).join(", ") ||
                      "None"}
                  </Typography>
                </ListItemContent>
              );
            }}
          />
        </Stack>
        <VerticalDivider />
        <Stack height="100%" flex={1}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mb={2}
          >
            <Typography level="h4" sx={{ fontSize: "md" }}>
              Questions in Editor
            </Typography>
            <Button
              component={Link}
              disabled={!hasDiff}
              color="success"
              startDecorator={<GithubIcon />}
              size="sm"
              href={`/modules/${questionBank}/questions/editor/submit`}
            >
              Create a change Request
            </Button>
          </Stack>
          <SearchList
            forceMode="mobile"
            sx={{ flex: 1, overflow: "hidden" }}
            items={items.map((id) => ({ id, questionBank, questionId: id }))}
            noDataMessage={"No changes so far!"}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={QuestionManagerEditorListItem}
          />
        </Stack>
      </Stack>
    );
  },
);

QuestionEditorManager.displayName = "QuestionEditorManager";

QuestionEditorManager.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getQuestionEditorManager.fetch({ questionBank });
};

QuestionEditorManager.useData = (params: Params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getQuestionEditorManager.useSuspenseQuery({ questionBank })[0];
};
