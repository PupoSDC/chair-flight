import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { questionSearchFilters } from "@cf/core/search";
import { processTest } from "@cf/core/tests";
import { createUsePersistenceHook } from "@cf/react/components";
import { useTestProgress } from "./use-test-progress";
import type { QuestionBankName } from "@cf/core/question-bank";

const filterSchema = z.object({
  mode: z.enum(["all", "study", "exam"]).default("all"),
  status: z.enum(["all", "created", "started", "finished"]).default("all"),
});

const defaultFilter = filterSchema.parse({});
const resolver = zodResolver(questionSearchFilters);

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-test-search-atpl", defaultFilter),
  type: createUsePersistenceHook("cf-test-search-type", defaultFilter),
  prep: createUsePersistenceHook("cf-test-search-prep", defaultFilter),
};

export const useSearchTests = ({
  questionBank,
}: {
  questionBank: QuestionBankName;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const tests = useTestProgress((s) => s.tests);
  const persistedData = useSearchPersistence[questionBank]();
  const defaultValues = persistedData.getData();
  const filterForm = useForm({ defaultValues, resolver });

  const mode = filterForm.watch("mode");
  const status = filterForm.watch("status");

  filterForm.watch((data) =>
    persistedData.setData({
      ...defaultFilter,
      ...data,
    }),
  );

  const items = Object.values(tests)
    .sort((a, b) => b.createdAtEpochMs - a.createdAtEpochMs)
    .filter((test) => {
      if (test.questionBank !== questionBank) return false;
      if (status !== "all" && status !== test.status) return false;
      if (mode !== "all" && mode !== test.mode) return false;
      if (
        searchQuery &&
        !test.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .map(processTest);

  return {
    searchQuery,
    setSearchQuery,
    filterForm,
    isLoading: false,
    isError: false,
    items,
  };
};
