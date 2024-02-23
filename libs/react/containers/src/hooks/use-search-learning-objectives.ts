import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { learningObjectiveSearchFilters } from "@cf/core/search";
import { createUsePersistenceHook } from "@cf/react/components";
import { trpc } from "@cf/trpc/client";
import type { QuestionBankName } from "@cf/core/question-bank";

const defaultFilter = learningObjectiveSearchFilters.parse({});
const resolver = zodResolver(learningObjectiveSearchFilters);
const keyPrefix = "cf-learning-objectives-search" as const;
const searchLos = trpc.common.search.searchLearningObjectives;
const useSearchLosQuery = searchLos.useInfiniteQuery;

const useSearchPersistence = {
  atpl: createUsePersistenceHook(`${keyPrefix}-atpl`, defaultFilter),
  type: createUsePersistenceHook(`${keyPrefix}-type`, defaultFilter),
  prep: createUsePersistenceHook(`${keyPrefix}-prep`, defaultFilter),
};

export const useSearchLearningObjectives = ({
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
  const course = filterForm.watch("course");
  const filters = { subject, course };

  const los = useSearchLosQuery(
    { q: searchQuery, questionBank, limit: 20, searchField, filters },
    { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
  );

  filterForm.watch((data) =>
    persistedData.setData({
      ...defaultFilter,
      ...data,
    }),
  );

  const items = los.data?.pages.flatMap((p) => p.items) ?? [];

  return {
    searchQuery,
    setSearchQuery,
    filterForm,
    isLoading: los.isLoading,
    isError: los.isError,
    fetchNextPage: los.fetchNextPage,
    items,
    course,
  };
};
