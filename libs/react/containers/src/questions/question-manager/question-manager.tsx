import { useForm } from "react-hook-form";
import { Box, Button, ListItemContent, Stack, Tooltip, Typography } from "@mui/joy";
import { container, getRequiredParam } from "../../wraper/container";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import { getQuestionPreview, type QuestionBankName } from "@chair-flight/core/question-bank";
import { LoadingButton, MarkdownClientCompressed, SearchHeader, SearchList, type SearchListProps } from "@chair-flight/react/components";
import { trpc, type AppRouterOutput } from "@chair-flight/trpc/client";
import { questionSearchFilters } from "@chair-flight/core/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import { default as EditIcon } from "@mui/icons-material/EditOutlined";
import { default as GithubIcon } from "@mui/icons-material/GitHub";
import { default as UndoIcon } from '@mui/icons-material/Undo';
import { default as AddInput } from '@mui/icons-material/InputOutlined';

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
    const editor = useQuestionEditor({ questionBank });
    const serverData = QuestionManager.useData({ questionBank });

    const filterForm = useForm({
      defaultValues: filterFormDefaultValues,
      resolver: filterFormResolver,
    });

    const searchQuestions = useSearchQuestions(
      { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

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
            items={(searchQuestions.data?.pages ?? []).flatMap(
              (p) => p.items,
            )}
            onFetchNextPage={searchQuestions.fetchNextPage}
            sx={{ flex: 1, overflow: "hidden" }}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={(result) => (
              <ListItemContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  ...(editor.isDeleted(result.id) && {
                    textDecoration: "line-through",
                    background: `repeating-linear-gradient(
                            45deg,
                            rgba(0, 0, 0, 0),
                            rgba(0, 0, 0, 0) 10px,
                            rgba(196, 28, 28, 0.3) 10px,
                            rgba(196, 28, 28, 0.3) 20px
                          )`,
                  }),
                  ...(editor.isEdited(result.id) && {
                    background: `repeating-linear-gradient(
                            45deg,
                            rgba(0, 0, 0, 0),
                            rgba(0, 0, 0, 0) 10px,
                            rgba(234, 154, 62, 0.3) 10px,
                            rgba(234, 154, 62, 0.3) 20px
                          )`,
                  }),
                }}>
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Typography level="h5" sx={{ fontSize: "sm" }}>
                    {result.id}
                  </Typography>
                  <Typography sx={{ fontSize: "xs", fontWeight: 500 }}>
                    {result.relatedQuestions.map(q => q.id).join(", ")}
                  </Typography>
                  <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
                    {result.text}
                  </MarkdownClientCompressed>
                </Box>
                <Stack gap={1} >
                  {!editor.isTouched(result.id) && (
                    <Tooltip title="Add Question">
                      <LoadingButton
                        sx={{ px: 1 }}
                        size="sm"
                        variant="plain"
                        onClick={() => editor.addQuestion(result.id)}
                        children={<AddInput />}
                      />
                    </Tooltip>
                  )}
                </Stack>
              </ListItemContent>
            )}
          />
        </Stack>
        <VerticalDivider />
        <Stack height="100%" flex={1}>
          <Stack direction={"row"} sx={{ mb: 2 }}>
            <Typography level="h3">Changes</Typography>
            <Tooltip title={"Create a pull Request"} variant="soft">
              <Button
                size="sm"
                sx={{ ml: "auto" }}
                color={"success"}
                endDecorator={<GithubIcon />}
                children={"Create a Pull Request"}
              />
            </Tooltip>
          </Stack>
          <SearchList
            forceMode="mobile"
            sx={{ flex: 1, overflow: "hidden" }}
            items={Object
              .entries(editor.currentState)
              .map(([id, value]) => ({ id, value }))
            }
            noDataMessage={"No changes so far!"}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={(result) => (
              <ListItemContent
                sx={{
                  display: "flex",
                  minHeight: 100,
                  ...(editor.isDeleted(result.id) && {
                    textDecoration: "line-through",
                    background: `repeating-linear-gradient(
                      45deg,
                      rgba(0, 0, 0, 0),
                      rgba(0, 0, 0, 0) 10px,
                      rgba(196, 28, 28, 0.3) 10px,
                      rgba(196, 28, 28, 0.3) 20px
                    )`,
                  }),
                }}
              >
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Typography level="h5" sx={{ fontSize: "sm" }}>
                    {result.id}
                  </Typography>
                  {result.value && (
                    <Typography sx={{ fontSize: "xs", fontWeight: 500 }}>
                      {result.value.relatedQuestions.join(", ")}
                    </Typography>
                 )}
                  {result.value && (
                    <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
                      {getQuestionPreview(result.value)}
                    </MarkdownClientCompressed>
                  )}
                </Box>
                <Stack gap={1}>
                  {editor.isEdited(result.id) && (
                    <Tooltip title="Edit Question">
                      <LoadingButton
                        sx={{ px: 1 }}
                        size="sm"
                        variant="plain"
                        color="success"
                        children={<EditIcon />}
                      />
                    </Tooltip>
                  )}
                  {editor.isDeleted(result.id) ? (
                    <Tooltip title="Recover Question">
                      <LoadingButton
                        sx={{ px: 1 }}
                        size="sm"
                        variant="plain"
                        color="danger"
                        onClick={() => editor.unDeleteQuestion(result.id)}
                        children={<UndoIcon />}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Delete Question">
                      <LoadingButton
                        sx={{ px: 1 }}
                        size="sm"
                        variant="plain"
                        color="danger"
                        onClick={() => editor.deleteQuestion(result.id)}
                        children={<DeleteIcon />}
                      />
                    </Tooltip>
                  )}

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

