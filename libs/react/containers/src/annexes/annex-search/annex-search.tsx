import { FunctionComponent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { default as Image } from "next/image";
import {
  Select,
  Stack,
  Option,
  selectClasses,
  Box,
  Modal,
  ModalDialog,
  ModalClose,
  Link,
  ListItemContent,
  Typography,
} from "@mui/joy";
import {
  HookFormSelect,
  SearchFilters,
  SearchHeader,
  SearchList,
  SearchQuery,
  useDisclose,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { useSearchConfig } from "./annex-search-config-schema";
import type {
  QuestionBankName,
  QuestionBankSubject,
} from "@chair-flight/base/types";
import { AppRouterOutput } from "@chair-flight/trpc/server";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUsePersistenceHook } from "../../hooks/use-persistence";

const useAnnexSearch =
  trpc.questionBankAnnexSearch.searchAnnexes.useInfiniteQuery;

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = AppRouterOutput["questionBankAnnexSearch"]["getSearchConfigFilters"];
type SearchResult = AppRouterOutput["questionBankAnnexSearch"]["searchAnnexes"]["items"][number]

const AnnexSearchItem: FunctionComponent<{
  mobile?: boolean;
  result: SearchResult;
}> = ({ result, mobile }) => {
  const imagePreviewModal = useDisclose();
  return (
    <>
      {mobile ? (
        <ListItemContent sx={{ display: "flex" }}>
          <Image
            src={result.href}
            alt=""
            width={100}
            height={100}
            onClick={imagePreviewModal.open}
          />
          <Box sx={{ pl: 1 }}>
            <Typography level="h5" sx={{ fontSize: 14 }}>
              Questions
            </Typography>
            {result.questions.map(({ href, id }) => (
              <Link href={href} key={id} sx={{ fontSize: "xs", pr: 1 }}>
                {id}
              </Link>
            ))}
          </Box>
        </ListItemContent>
      ) : (
        <tr>
          <Box component="td" sx={{ height: "200px !important" }}>
            <Image
              onClick={imagePreviewModal.open}
              src={result.href}
              alt=""
              width={200}
              height={200}
              style={{ width: "auto", maxWidth: 270, height: "100%" }}
            />
            <Box component="b" sx={{ fontSize: 12 }}>
              {result.id}
            </Box>
          </Box>
          <td>{result.description}</td>
          <td>{result.subjects.join(", ")}</td>
          <td>
            {result.learningObjectives.map(({ href, id }) => (
              <Link href={href} key={id} sx={{ display: "block" }}>
                {id}
              </Link>
            ))}
          </td>
          <td>
            {result.questions.map(({ href, id }) => (
              <Link href={href} key={id} sx={{ display: "block" }}>
                {id}
              </Link>
            ))}
          </td>
        </tr>
      )}
      <Modal open={imagePreviewModal.isOpen} onClose={imagePreviewModal.close}>
        <ModalDialog>
          <ModalClose variant="solid" />
          <Stack>
            <img
              src={result.href}
              alt=""
              style={{
                objectFit: "contain",
                maxWidth: "90vw",
                maxHeight: "90vh",
                width: "auto",
                height: "auto",
              }}
            />
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
};

const filterSchema = z.object({
  subject: z.string().default("all"),
});

const defaultFilter = filterSchema.parse({});
const resolver = zodResolver(filterSchema);
const searchQuestions = trpc.questionBankAnnexSearch.searchAnnexes;
const useSearchAnnexes = searchQuestions.useInfiniteQuery;

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-annex-search-atpl", defaultFilter),
  type: createUsePersistenceHook("cf-annex-search-type", defaultFilter),
  prep: createUsePersistenceHook("cf-annex-search-prep", defaultFilter),
};

export const AnnexSearch = container<Props, Params, Data>(
  ({ sx, component = "section", questionBank }) => {
    const [search, setSearch] = useState("");
    const { getData, setData } = useSearchPersistence[questionBank]();
    const serverData = AnnexSearch.useData({ questionBank });
    const form = useForm({ defaultValues: getData(), resolver });

    const { subjects } = serverData;
    const { subject } = form.watch();

    const { data, isLoading, isError, fetchNextPage } = useSearchAnnexes(
      { q: search, questionBank, subject, limit: 24 },
      { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
    );

    form.watch((data) => setData({ ...defaultFilter, ...data }));

    const numberOfFilters = Number(subject !== "all");

    return (
      <Stack component={component} sx={sx}>
        <SearchHeader>
          <SearchQuery
            size="sm"
            value={search}
            loading={isLoading}
            onChange={(value) => setSearch(value)}
            sx={{ flex: 1 }}
            placeholder="search Annexes..."
          />

          <SearchFilters
            activeFilters={numberOfFilters}
            fallback={<Select size="sm" />}
            filters={
              <FormProvider {...form}>
                <HookFormSelect size="sm" {...form.register("subject")}>
                  {subjects.map(({ id, text }) => (
                    <Option value={id} key={id}>
                      {text}
                    </Option>
                  ))}
                </HookFormSelect>
              </FormProvider>
            }
          />
        </SearchHeader>

        <SearchList
          loading={isLoading}
          error={isError}
          items={(data?.pages ?? []).flatMap((p) => p.items)}
          onFetchNextPage={fetchNextPage}
          sx={{ flex: 1, overflow: "hidden" }}
          renderThead={() => (
            <thead>
              <tr>
                <th style={{ width: 300 }}>Image</th>
                <th style={{ width: 200 }}>Description</th>
                <th style={{ width: 100 }}>Subjects</th>
                <th style={{}}>Learning Objectives</th>
                <th style={{}}>Questions</th>
              </tr>
            </thead>
          )}
          renderTableRow={(result) => (
            <AnnexSearchItem result={result} mobile={false} />
          )}
          renderListItemContent={(result) => (
            <AnnexSearchItem result={result} mobile={true} />
          )}
        />
      </Stack>
    );
  },
);

AnnexSearch.displayName = "AnnexSearch";

AnnexSearch.getData = async ({ helper, params }) => {
  const router = helper.questionBankAnnexSearch; 
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getSearchConfigFilters.fetch({ questionBank });
};

AnnexSearch.useData = (params) => {
  const router = trpc.questionBankAnnexSearch; 
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getSearchConfigFilters.useSuspenseQuery({ questionBank })[0];
};