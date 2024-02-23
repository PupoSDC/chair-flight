import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { annexSearchFilters } from "@cf/core/search";
import { createUsePersistenceHook } from "@cf/react/components";
import { trpc } from "@cf/trpc/client";
import type { QuestionBankName } from "@cf/core/question-bank";

const defaultFilter = annexSearchFilters.parse({});
const resolver = zodResolver(annexSearchFilters);
const searchAnnexes = trpc.common.search.searchAnnexes;
const useSearchAnnexesQuery = searchAnnexes.useInfiniteQuery;

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-annex-search-atpl", defaultFilter),
  type: createUsePersistenceHook("cf-annex-search-type", defaultFilter),
  prep: createUsePersistenceHook("cf-annex-search-prep", defaultFilter),
};

export const useSearchAnnexes = ({
  questionBank,
}: {
  questionBank: QuestionBankName;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const persistedData = useSearchPersistence[questionBank]();
  const defaultValues = persistedData.getData();
  const filterForm = useForm({ defaultValues, resolver });

  const searchField = filterForm.watch("searchField");
  const subject = filterForm.watch("subject");
  const filters = { subject };

  const annexes = useSearchAnnexesQuery(
    { q: searchQuery, questionBank, limit: 24, searchField, filters },
    { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
  );

  filterForm.watch((data) =>
    persistedData.setData({
      ...defaultFilter,
      ...data,
    }),
  );

  const items = annexes.data?.pages.flatMap((p) => p.items) ?? [];

  return {
    searchQuery,
    setSearchQuery,
    filterForm,
    isLoading: annexes.isLoading,
    isError: annexes.isError,
    fetchNextPage: annexes.fetchNextPage,
    items,
  };
};
