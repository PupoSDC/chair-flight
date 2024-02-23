import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSearchFilters } from "@cf/core/search";
import { createUsePersistenceHook } from "@cf/react/components";
import { trpc } from "@cf/react/trpc";
import type { QuestionBankName } from "@cf/core/question-bank";

const defaultFilter = questionSearchFilters.parse({});
const resolver = zodResolver(questionSearchFilters);
const searchQuestions = trpc.search.searchQuestions;
const useSearchQuestionsQuery = searchQuestions.useInfiniteQuery;

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-question-search-atpl", defaultFilter),
  type: createUsePersistenceHook("cf-question-search-type", defaultFilter),
  prep: createUsePersistenceHook("cf-question-search-prep", defaultFilter),
};

export const useSearchQuestions = ({
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

  const questions = useSearchQuestionsQuery(
    { q: searchQuery, questionBank, limit: 24, searchField, filters },
    { getNextPageParam: (l) => l.nextCursor, initialCursor: 0 },
  );

  filterForm.watch((data) =>
    persistedData.setData({
      ...defaultFilter,
      ...data,
    }),
  );

  const items = questions.data?.pages.flatMap((p) => p.items) ?? [];

  return {
    searchQuery,
    setSearchQuery,
    filterForm,
    isLoading: questions.isLoading,
    isError: questions.isError,
    fetchNextPage: questions.fetchNextPage,
    items,
  };
};
