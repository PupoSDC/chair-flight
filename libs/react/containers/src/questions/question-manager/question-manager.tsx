import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as AddInput } from "@mui/icons-material/InputOutlined";
import {
  Box,
  Divider,
  ListItemContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { type QuestionBankName } from "@chair-flight/core/question-bank";
import { questionSearchFilters } from "@chair-flight/core/search";
import {
  LoadingButton,
  MarkdownClientCompressed,
  SearchHeader,
  SearchList,
} from "@chair-flight/react/components";
import { trpc, type AppRouterOutput } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import type { QuestionId } from "@chair-flight/core/question-bank";

type Props = {
  questionBank: QuestionBankName;
};

type Params = Props;

type Data = AppRouterOutput["containers"]["questions"]["getQuestionManager"];

const search = trpc.common.search;
const useSearchQuestions = search.searchQuestions.useInfiniteQuery;
const useRetrieveQuestions = search.retrieveQuestions.useQuery;
const filterFormDefaultValues = questionSearchFilters.parse({});
const filterFormResolver = zodResolver(questionSearchFilters);
type FilterKeys = keyof Data["filters"];

export const QuestionManager = container<Props, Params, Data>(
  ({ sx, component = "div", questionBank }) => {
    const [search, setSearch] = useState("");
    const utils = trpc.useUtils();
    const serverData = QuestionManager.useData({ questionBank });
    const addQuestionToEditor = useQuestionEditor((s) => s.addQuestion);
    const removeQuestionFromEditor = useQuestionEditor((s) => s.removeQuestion);
    const isQuestionInEditor = useQuestionEditor((s) => s.isQuestionInEditor);

    const currentIds = useQuestionEditor((s) => {
      return Object.keys(s[questionBank].afterState).reverse();
    });

    const filterForm = useForm<Record<FilterKeys, string>>({
      defaultValues: filterFormDefaultValues,
      resolver: filterFormResolver,
    });

    const searchQuestions = useSearchQuestions(
      { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    const retrieveQuestions = useRetrieveQuestions(
      { questionBank, ids: currentIds },
      { keepPreviousData: true },
    );

    const addQuestion = (id: QuestionId) => {
      addQuestionToEditor(utils, questionBank, id);
    };

    const removeQuestion = (id: QuestionId) => {
      removeQuestionFromEditor(utils, questionBank, id);
    };

    return (
      <Stack direction="row" component={component} sx={sx}>
        <Stack height="100%" flex={1}>
          <SearchHeader
            search={search}
            searchPlaceholder="Search Annexes..."
            filters={serverData.filters}
            filterValues={filterForm.watch()}
            isLoading={searchQuestions.isLoading}
            isError={searchQuestions.isError}
            onSearchChange={setSearch}
            onFilterValuesChange={(k, v) =>
              filterForm.setValue(k as FilterKeys, v)
            }
          />
          <SearchList
            forceMode={"mobile"}
            loading={searchQuestions.isLoading}
            error={searchQuestions.isError}
            items={(searchQuestions.data?.pages ?? []).flatMap((p) => p.items)}
            onFetchNextPage={searchQuestions.fetchNextPage}
            sx={{ flex: 1, overflow: "hidden" }}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={(result) => (
              <ListItemContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  ...(isQuestionInEditor(questionBank, result.id) && {
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
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Typography level="h5" sx={{ fontSize: "sm" }}>
                    {result.id}
                  </Typography>
                  <Typography sx={{ fontSize: "xs", fontWeight: 500 }}>
                    {result.relatedQuestions.map((q) => q.id).join(", ")}
                  </Typography>
                  <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
                    {result.text}
                  </MarkdownClientCompressed>
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
                </Box>
                <Stack gap={1}>
                  {!isQuestionInEditor(questionBank, result.id) && (
                    <Tooltip
                      title={
                        <>
                          Add Question.
                          <br />
                          Note: All related questions will be added as well.
                        </>
                      }
                      children={
                        <LoadingButton
                          sx={{ px: 1 }}
                          size="sm"
                          variant="plain"
                          onClick={() => addQuestion(result.id)}
                          children={<AddInput />}
                        />
                      }
                    />
                  )}
                </Stack>
              </ListItemContent>
            )}
          />
        </Stack>
        <VerticalDivider />
        <Stack height="100%" flex={1}>
          <SearchList
            forceMode="mobile"
            sx={{ flex: 1, overflow: "hidden" }}
            items={retrieveQuestions.data?.items ?? []}
            noDataMessage={"No changes so far!"}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={(result) => (
              <ListItemContent sx={{ display: "flex", minHeight: 100 }}>
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Typography level="h5" sx={{ fontSize: "sm" }}>
                    {result.id}
                  </Typography>
                  <Typography sx={{ fontSize: "xs", fontWeight: 500 }}>
                    {result.relatedQuestions.map((q) => q.id).join(", ")}
                  </Typography>
                  <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
                    {result.text}
                  </MarkdownClientCompressed>
                </Box>
                <Stack gap={1}>
                  {
                    <Tooltip
                      title={
                        <>
                          Remove Question.
                          <br />
                          Note: All related questions will be removed as well.
                        </>
                      }
                      children={
                        <LoadingButton
                          sx={{ px: 1 }}
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={() => removeQuestion(result.id)}
                          children={
                            <AddInput
                              sx={{
                                transform: "rotate(180deg)",
                              }}
                            />
                          }
                        />
                      }
                    />
                  }
                </Stack>
              </ListItemContent>
            )}
          />
        </Stack>
      </Stack>
    );
  },
);

QuestionManager.displayName = "QuestionManager";

QuestionManager.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getQuestionManager.fetch({ questionBank });
};

QuestionManager.useData = (params: Params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getQuestionManager.useSuspenseQuery({ questionBank })[0];
};
