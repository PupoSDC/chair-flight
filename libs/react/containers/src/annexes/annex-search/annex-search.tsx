import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { default as Image } from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  Stack,
  Option,
  Box,
  Modal,
  ModalDialog,
  ModalClose,
  Link,
  ListItemContent,
  Typography,
} from "@mui/joy";
import { z } from "zod";
import type {
  SearchListProps} from "@chair-flight/react/components";
import {
  HookFormSelect,
  SearchFilters,
  SearchHeader,
  SearchList,
  SearchQuery,
  Ups,
  useDisclose,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import { container, getRequiredParam } from "../../wraper/container";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { AppRouterOutput } from "@chair-flight/trpc/client";
import type { FunctionComponent } from "react";

type Props = {
  questionBank: QuestionBankName;
  forceMode?: SearchListProps<{ id: string }>["forceMode"];
};

type Params = {
  questionBank: QuestionBankName;
};

type Data =
  AppRouterOutput["questionBankAnnexSearch"]["getSearchConfigFilters"];
type SearchResult =
  AppRouterOutput["questionBankAnnexSearch"]["searchAnnexes"]["items"][number];

const AnnexSearchItem: FunctionComponent<{
  mobile?: boolean;
  result: SearchResult;
}> = ({ result, mobile }) => {
  const imagePreviewModal = useDisclose();
  const [error, setError] = useState(false);
  return (
    <>
      {mobile ? (
        <ListItemContent sx={{ display: "flex" }}>
          {error ? (
            <Ups
              sx={{
                flex: "initial",
                width: 100,
                height: 100,
                minHeight: 0,
                "& svg": {
                  width: 50,
                  height: 50,
                },
                "& h3": {
                  fontSize: "14px",
                },
              }}
              message="Not Found"
            />
          ) : (
            <Image
              src={result.href}
              alt=""
              width={100}
              height={100}
              onClick={imagePreviewModal.open}
              onError={() => setError(true)}
            />
          )}
          <Box sx={{ pl: 1 }}>
            <Typography level="h5" sx={{ fontSize: 14 }}>
              Questions
            </Typography>
            {result.questions.map(({ href, id }) => (
              <Link href={href} key={id} sx={{ fontSize: "xs", pr: 1 }}>
                {id}
              </Link>
            ))}
            <Typography level="h5" sx={{ fontSize: 14 }}>
              Learning OBjectives
            </Typography>
            {result.learningObjectives.map(({ href, id }) => (
              <Link href={href} key={id} sx={{ fontSize: "xs", pr: 1 }}>
                {id}
              </Link>
            ))}
          </Box>
        </ListItemContent>
      ) : (
        <tr>
          <Box component="td" sx={{ height: "200px !important" }}>
            {error ? (
              <Ups
                sx={{
                  flex: "initial",
                  width: 200,
                  height: 200,
                  minHeight: 0,
                  "& svg": {
                    width: 100,
                    height: 100,
                  },
                  "& h3": {
                    fontSize: "18px",
                  },
                }}
                message="Not Found"
              />
            ) : (
              <Image
                onClick={imagePreviewModal.open}
                src={result.href}
                alt=""
                width={200}
                height={200}
                style={{ width: "auto", maxWidth: 270, height: "100%" }}
                onError={() => setError(true)}
              />
            )}
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
  ({ sx, component = "section", questionBank, forceMode }) => {
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
          forceMode={forceMode}
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
