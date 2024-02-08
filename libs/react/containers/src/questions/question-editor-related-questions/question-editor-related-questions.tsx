import { memo, useState } from "react";
import { default as AddIcon } from "@mui/icons-material/Add";
import { default as UnlinkIcon } from "@mui/icons-material/LinkOff";
import { Box, ListItemContent, Stack, Tooltip, Typography } from "@mui/joy";
import { makeMap } from "@chair-flight/base/utils";
import {
  type QuestionBankName,
  type QuestionTemplateId,
} from "@chair-flight/core/question-bank";
import {
  LoadingButton,
  MarkdownClientCompressed,
  SearchHeader,
  SearchList,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import { useQuestionSearchConfig } from "../hooks/use-question-search-config";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorRelatedQuestions"];

type FilterKeys = keyof Data["filters"];

const search = trpc.common.search;
const useSearchQuestions = search.searchQuestions.useInfiniteQuery;

const SearchListItem = memo<{
  questionId: QuestionTemplateId;
  questionBank: QuestionBankName;
}>(({ questionBank, questionId }) => {
  const { unlinkQuestion, getDiffStatus } = useQuestionEditor((s) => ({
    unlinkQuestion: s.unlinkQuestion,
    getDiffStatus: s.getDiffStatus,
  }));

  const { current } = getDiffStatus({ questionBank, questionId });

  return (
    <ListItemContent sx={{ display: "flex" }}>
      <Box sx={{ flex: 1, px: 1 }}>
        <Typography level="h5" sx={{ fontSize: "sm" }}>
          {questionId}
        </Typography>
        <MarkdownClientCompressed sx={{ fontSize: "xs" }}>
          {current.preview}
        </MarkdownClientCompressed>
      </Box>
      <Box>
        <Tooltip title="Disconnect Question">
          <LoadingButton
            sx={{ px: 1 }}
            size="sm"
            variant="plain"
            children={<UnlinkIcon />}
            onClick={() => unlinkQuestion({ questionBank, questionId })}
          />
        </Tooltip>
      </Box>
    </ListItemContent>
  );
});

export const QuestionEditorRelatedQuestions = container<Props, Params, Data>(
  ({ sx, component = "div", questionId, questionBank }) => {
    const utils = trpc.useUtils();
    const [search, setSearch] = useState("");
    const serverData = QuestionEditorRelatedQuestions.useData({ questionBank });
    const filterForm = useQuestionSearchConfig({ questionBank });

    const { connectTwoQuestions, relatedQs } = useQuestionEditor((s) => ({
      connectTwoQuestions: s.connectTwoQuestions,
      relatedQs: s[questionBank].afterState[questionId]?.relatedQuestions ?? [],
    }));

    const searchQuestions = useSearchQuestions(
      { q: search, questionBank, filters: filterForm.watch(), limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    const connectedQuestions = makeMap(
      [questionId, ...relatedQs],
      (id) => id,
      () => true,
    );

    return (
      <Stack component={component} sx={sx}>
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
        <Stack flex={1} flexDirection={"row"} overflow={"hidden"}>
          <SearchList
            forceMode={"mobile"}
            loading={searchQuestions.isLoading}
            error={searchQuestions.isError}
            items={(searchQuestions.data?.pages ?? [])
              .flatMap((p) => p.items)
              .filter((q) => !connectedQuestions[q.id])}
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
                    <LoadingButton
                      sx={{ px: 1 }}
                      size="sm"
                      variant="plain"
                      children={<AddIcon />}
                      onClick={() =>
                        connectTwoQuestions({
                          trpc: utils,
                          questionBank: questionBank,
                          questionA: questionId,
                          questionB: result.id,
                        })
                      }
                    />
                  </Tooltip>
                </Box>
              </ListItemContent>
            )}
          />

          <VerticalDivider />

          <SearchList
            forceMode={"mobile"}
            noDataMessage="No Related Questions"
            items={relatedQs.map((id) => ({
              id,
              questionId: id,
              questionBank,
            }))}
            sx={{ flex: 1, overflow: "hidden", width: "100%" }}
            renderThead={() => null}
            renderTableRow={() => null}
            renderListItemContent={SearchListItem}
          />
        </Stack>
      </Stack>
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
