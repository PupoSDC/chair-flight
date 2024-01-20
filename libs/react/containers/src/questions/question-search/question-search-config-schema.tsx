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
  "cf-question-search-atpl": createUsePersistenceHook<SearchConfig>(
    "cf-question-search-atpl",
  ),
  "cf-question-search-type": createUsePersistenceHook<SearchConfig>(
    "cf-question-search-type",
  ),
  "cf-question-search-prep": createUsePersistenceHook<SearchConfig>(
    "cf-question-search-prep",
  ),
};

const resolver = zodResolver(searchConfigSchema);

export const useSearchConfig = (
  questionBank: QuestionBankName,
): [SearchConfig, UseFormReturn<SearchConfig>] => {
  const key = `cf-question-search-${questionBank}` as const;
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
