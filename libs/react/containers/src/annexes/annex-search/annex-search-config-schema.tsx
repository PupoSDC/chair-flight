import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { UseFormReturn } from "react-hook-form";

const searchConfigSchema = z.object({
  searchField: z.enum([
    "all",
    "questionId",
    "learningObjectives",
    "text",
    "externalIds",
  ]),
  subject: z.string(),
});

type SearchConfig = z.infer<typeof searchConfigSchema>;

const defaultSearchConfig: z.infer<typeof searchConfigSchema> = {
  searchField: "all",
  subject: "all",
};

const searchPersistence = {
  "cf-annex-search-atpl": createUsePersistenceHook<SearchConfig>(
    "cf-annex-search-atpl",
  ),
  "cf-annex-search-type": createUsePersistenceHook<SearchConfig>(
    "cf-annex-search-type",
  ),
  "cf-annex-search-prep": createUsePersistenceHook<SearchConfig>(
    "cf-annex-search-prep",
  ),
};

const resolver = zodResolver(searchConfigSchema);

export const useSearchConfig = (
  questionBank: QuestionBankName,
): [SearchConfig, UseFormReturn<SearchConfig>] => {
  const key = `cf-annex-search-${questionBank}` as const;
  const useSearchPersistence = searchPersistence[key];
  const { persistedData, setPersistedData } = useSearchPersistence();
  const defaultValues = persistedData ?? defaultSearchConfig;
  const form = useForm({ defaultValues, resolver });
  const searchField = form.watch("searchField");
  const subject = form.watch("subject");

  useEffect(() => {
    setPersistedData({ searchField, subject });
  }, [searchField, subject, setPersistedData]);

  return [{ searchField, subject }, form];
};
