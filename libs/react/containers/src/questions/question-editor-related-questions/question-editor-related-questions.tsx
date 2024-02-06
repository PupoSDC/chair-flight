import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as DeleteIcon } from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Button,
  ListItemContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { questionSearchFilters } from "@chair-flight/core/search";
import {
  MarkdownClientCompressed,
  SearchHeader,
  SearchList,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorRelatedQuestions"];

const search = trpc.common.search;
const useSearchQuestions = search.searchQuestions.useInfiniteQuery;
const useRetrieveQuestions = search.retrieveQuestions.useQuery;
const filterFormDefaultValues = questionSearchFilters.parse({});
const filterFormResolver = zodResolver(questionSearchFilters);
type FilterKeys = keyof Data["filters"];

export const QuestionEditorRelatedQuestions = container<Props, Params, Data>(
  ({ questionId, questionBank }) => {
    const field = `editedQuestions.${questionId}.relatedQuestions` as const;

    const [search, setSearch] = useState("");

    const { form } = useQuestionEditor({ questionBank });

    const questions = form.watch(field);

    const serverData = QuestionEditorRelatedQuestions.useData({
      questionBank,
      questionId,
    });

    const filterForm = useForm({
      defaultValues: filterFormDefaultValues,
      resolver: filterFormResolver,
    });

    const searchQuestions = useSearchQuestions(
      { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    const retrieveQuestions = useRetrieveQuestions(
      { ids: questions ?? [], questionBank },
      { keepPreviousData: true },
    );

    const addAnnex = (id: string) => {
      form.setValue(field, [...(form.getValues(field) ?? []), id]);
    };

    const removeAnnex = (id: string) => {
      form.setValue(
        field,
        (form.getValues(field) ?? []).filter((i: string) => i !== id),
      );
    };

    return (
      <FormProvider {...form}>
        <Stack direction="row" height="100%" width="100%">
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
                <ListItemContent sx={{ display: "flex" }}>
                  <Box sx={{ flex: 1, pr: 1 }}>
                    <Typography level="h5" sx={{ fontSize: "sm" }}>
                      {result.id}
                    </Typography>
                    <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
                      {result.text}
                    </MarkdownClientCompressed>
                  </Box>
                  <Box>
                    <Tooltip title="Add to Question">
                      <Button
                        sx={{ px: 1 }}
                        size="sm"
                        variant="plain"
                        disabled={questions.includes(result.id)}
                        onClick={() => addAnnex(result.id)}
                        children={<AddIcon />}
                      />
                    </Tooltip>
                  </Box>
                </ListItemContent>
              )}
            />
          </Stack>
          <VerticalDivider />
          <Stack height="100%" flex={1}>
            <SearchList
              forceMode={"mobile"}
              noDataMessage="No Annexes selected"
              loading={retrieveQuestions.isLoading}
              error={retrieveQuestions.isError}
              items={retrieveQuestions.data?.items ?? []}
              sx={{ flex: 1, overflow: "hidden", width: "100%" }}
              renderThead={() => null}
              renderTableRow={() => null}
              renderListItemContent={(result) => (
                <ListItemContent sx={{ display: "flex" }}>
                  <Box sx={{ flex: 1, px: 1 }}>
                    <Typography level="h5" sx={{ fontSize: "sm" }}>
                      {result.id}
                    </Typography>
                    <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
                      {result.text}
                    </MarkdownClientCompressed>
                  </Box>
                  <Box>
                    <Tooltip title="Remove from Question">
                      <Button
                        sx={{ px: 1 }}
                        size="sm"
                        variant="plain"
                        onClick={() => removeAnnex(result.id)}
                        children={<DeleteIcon />}
                      />
                    </Tooltip>
                  </Box>
                </ListItemContent>
              )}
            />
          </Stack>
        </Stack>
      </FormProvider>
    );
  },
);

QuestionEditorRelatedQuestions.displayName = "QuestionEditorRelatedQuestions";

QuestionEditorRelatedQuestions.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getQuestionEditorRelatedQuestions.fetch({ questionBank });
};

QuestionEditorRelatedQuestions.useData = (params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getQuestionEditorRelatedQuestions.useSuspenseQuery({
    questionBank,
  })[0];
};
