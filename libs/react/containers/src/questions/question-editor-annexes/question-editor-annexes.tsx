import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { default as Image } from "next/image";
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
import { annexSearchFilters } from "@chair-flight/core/search";
import { SearchHeader, SearchList } from "@chair-flight/react/components";
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
  AppRouterOutput["containers"]["questions"]["getQuestionEditorAnnexes"];

const search = trpc.common.search;
const useSearchAnnexes = search.searchAnnexes.useInfiniteQuery;
const useRetrieveAnnexes = search.retrieveAnnexes.useQuery;
const filterFormDefaultValues = annexSearchFilters.parse({});
const filterFormResolver = zodResolver(annexSearchFilters);
type FilterKeys = keyof Data["filters"];

export const QuestionEditorAnnexes = container<Props, Params, Data>(
  ({ questionId, questionBank }) => {
    const [search, setSearch] = useState("");

    const { form } = useQuestionEditor({ questionBank });

    const los = form.watch(`editedQuestions.${questionId}.learningObjectives`);

    const serverData = QuestionEditorAnnexes.useData({
      questionBank,
      questionId,
    });

    const filterForm = useForm({
      defaultValues: filterFormDefaultValues,
      resolver: filterFormResolver,
    });

    const searchAnnexes = useSearchAnnexes(
      { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    const retrieveAnnexes = useRetrieveAnnexes(
      { ids: los ?? [], questionBank },
      { keepPreviousData: true },
    );

    const addAnnex = (id: string) => {
      const field = `editedQuestions.${questionId}.learningObjectives` as const;
      form.setValue(field, [...(form.getValues(field) ?? []), id]);
    };

    const removeAnnex = (id: string) => {
      const field = `editedQuestions.${questionId}.learningObjectives` as const;
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
              isLoading={searchAnnexes.isLoading}
              isError={searchAnnexes.isError}
              onSearchChange={setSearch}
              onFilterValuesChange={(k, v) =>
                filterForm.setValue(k as FilterKeys, v)
              }
            />
            <SearchList
              forceMode={"mobile"}
              loading={searchAnnexes.isLoading}
              error={searchAnnexes.isError}
              items={(searchAnnexes.data?.pages ?? []).flatMap((p) => p.items)}
              onFetchNextPage={searchAnnexes.fetchNextPage}
              sx={{ flex: 1, overflow: "hidden" }}
              renderThead={() => null}
              renderTableRow={() => null}
              renderListItemContent={(result) => (
                <ListItemContent sx={{ display: "flex" }}>
                  <Image src={result.href} alt="" width={100} height={100} />
                  <Box sx={{ flex: 1, px: 2 }}>
                    <Typography level={"h5"}>{result.id}</Typography>
                    <Typography>{result.description}</Typography>
                  </Box>
                  <Box>
                    <Tooltip title="Add to Question">
                      <Button
                        sx={{ px: 1 }}
                        size="sm"
                        variant="plain"
                        disabled={los.includes(result.id)}
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
              loading={retrieveAnnexes.isLoading}
              error={retrieveAnnexes.isError}
              items={retrieveAnnexes.data?.items ?? []}
              sx={{ flex: 1, overflow: "hidden", width: "100%" }}
              renderThead={() => null}
              renderTableRow={() => null}
              renderListItemContent={(result) => (
                <ListItemContent sx={{ display: "flex" }}>
                  <Image src={result.href} alt="" width={100} height={100} />
                  <Box sx={{ flex: 1, px: 2 }}>
                    <Typography level={"h5"}>{result.id}</Typography>
                    <Typography>{result.description}</Typography>
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

QuestionEditorAnnexes.displayName = "QuestionEditorAnnexes";

QuestionEditorAnnexes.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getQuestionEditorAnnexes.fetch({ questionBank });
};

QuestionEditorAnnexes.useData = (params) => {
  const router = trpc.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getQuestionEditorAnnexes.useSuspenseQuery({
    questionBank,
  })[0];
};
