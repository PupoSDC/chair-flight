import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { default as Image } from "next/image";
import { Select, Stack, Option, selectClasses, Box, Modal, ModalDialog, ModalClose, Link, ListItemContent, Typography } from "@mui/joy";
import {
  SearchQuery,
  HookFormSelect,
  SearchFilters,
  SearchList,
  useDisclose,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { useSearchConfig } from "./annex-search-config-schema";
import type {
  QuestionBankName,
  QuestionBankSubject,
} from "@chair-flight/base/types";

const useAnnexSearch =
  trpc.questionBankAnnexSearch.searchAnnexes.useInfiniteQuery;

type Props = {
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = {
  subjects: QuestionBankSubject[];
};

export const AnnexSearch = container<Props, Params, Data>(
  ({ sx, component = "section", questionBank }) => {
    const [search, setSearch] = useState("");
    const [{ subject }, form] = useSearchConfig(questionBank);
    const { subjects } = AnnexSearch.useData({ questionBank });

    const { data, isLoading, isError, fetchNextPage } = useAnnexSearch(
      {
        questionBank,
        learningObjectives: null,
        subject: subject === "all" ? null : subject,
        limit: 24,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: 0,
      },
    );

    const numberOfFilters = Number(subject !== "all");

    return (
      <Stack component={component} sx={sx}>
        <Stack
          direction="row"
          sx={{
            mb: { xs: 1, sm: 2 },
            gap: 1,
            [`& .${selectClasses.root}`]: {
              width: "13em",
            },
          }}
        >
          <SearchQuery
            size="sm"
            value={search}
            loading={isLoading}
            onChange={(value) => setSearch(value)}
            sx={{ flex: 1 }}
            placeholder="search Questions..."
          />

          <SearchFilters
            activeFilters={numberOfFilters}
            fallback={
              <>
                <Select size="sm" />
                <Select size="sm" />
              </>
            }
            filters={
              <FormProvider {...form}>
                <HookFormSelect size="sm" {...form.register("subject")}>
                  <Option value={"all"}>All Subjects</Option>
                  {subjects.map(({ id, shortName }) => (
                    <Option value={id} key={id}>
                      {shortName}
                    </Option>
                  ))}
                </HookFormSelect>
              </FormProvider>
            }
          />
        </Stack>

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
                <th style={{ width: 100 }}>Subjects</th>
                <th style={{  }}>Learning Objectives</th>
                <th style={{  }}>Questions</th>
              </tr>
            </thead>
          )}
          renderTableRow={(result) => {
            const imagePreviewModal = useDisclose();
            return (
              <tr key={result.id}>
                <Box component="td" sx={{ height: "200px !important" }}>
                  <Image
                    onClick={imagePreviewModal.open}
                    src={result.src}
                    alt=""
                    width={200}
                    height={200}
                    style={{ width: 'auto', maxWidth: 270, height: '100%' }}
                  />
                  <Box component="b" sx={{ fontSize: 12 }}>{result.id}</Box>
                </Box>
                <td>
                  {result.subjects.join(", ")}
                </td>
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
                <Modal
                  open={imagePreviewModal.isOpen}
                  onClose={imagePreviewModal.close}
                >
                  <ModalDialog>
                    <ModalClose variant="solid" />
                    <Stack sx={{
                      maxHeight: "100%",
                      minWidth: "80vh",
                    }}>
                      <img
                        src={result.src}
                        alt=""
                        style={{
                          width: "100%",
                          height: "auto"
                        }}
                      />
                    </Stack>
                  </ModalDialog>
                </Modal>
              </tr>
            )
          }}
          renderListItemContent={(result) => {
            const imagePreviewModal = useDisclose();

            return (
              <ListItemContent sx={{ display: "flex" }}>
                <Image
                  src={result.src}
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
                    <Link href={href} key={id} sx={{ fontSize: "xs", pr: 1  }}>
                      {id}
                    </Link>
                  ))}
                </Box>

                <Modal
                  open={imagePreviewModal.isOpen}
                  onClose={imagePreviewModal.close}
                >
                  <ModalDialog>
                    <ModalClose variant="solid" />
                    <Stack sx={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                    }}>
                      <img
                        src={result.src}
                        alt=""
                        style={{
                          width: "100%",
                          height: "auto"
                        }}
                      />
                    </Stack>
                  </ModalDialog>
                </Modal>
              </ListItemContent>
            )
          }}
        />
      </Stack>
    );
  },
);

AnnexSearch.displayName = "AnnexSearch";

AnnexSearch.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] = await Promise.all([
    helper.questionBank.getAllSubjects.fetch({ questionBank }),
  ]);

  return {
    subjects: data.subjects,
  };
};

AnnexSearch.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");

  const [data] = trpc.questionBank.getAllSubjects.useSuspenseQuery({
    questionBank,
  });

  return {
    subjects: data.subjects,
  };
};
