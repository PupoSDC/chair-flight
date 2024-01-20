import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { UseFormReturn } from "react-hook-form";

const searchConfigSchema = z.object({
  mode: z.enum(["all", "study", "exam"]),
  status: z.enum(["all", "created", "started", "finished"]),
});

type SearchConfig = z.infer<typeof searchConfigSchema>;

const defaultSearchConfig: z.infer<typeof searchConfigSchema> = {
  mode: "all",
  status: "all",
};

const searchPersistence = {
  "cf-test-search-atpl": createUsePersistenceHook<SearchConfig>(
    "cf-test-search-atpl",
  ),
  "cf-test-search-type": createUsePersistenceHook<SearchConfig>(
    "cf-test-search-type",
  ),
  "cf-test-search-prep": createUsePersistenceHook<SearchConfig>(
    "cf-test-search-prep",
  ),
};

const resolver = zodResolver(searchConfigSchema);

export const useSearchConfig = (
  questionBank: QuestionBankName,
): [SearchConfig, UseFormReturn<SearchConfig>] => {
  const key = `cf-test-search-${questionBank}` as const;
  const useSearchPersistence = searchPersistence[key];
  const { persistedData, setPersistedData } = useSearchPersistence();
  const defaultValues = persistedData ?? defaultSearchConfig;
  const form = useForm({ defaultValues, resolver });
  const mode = form.watch("mode");
  const status = form.watch("status");

  useEffect(() => {
    setPersistedData({ mode, status });
  }, [mode, status, setPersistedData]);

  return [{ mode, status }, form];
};
