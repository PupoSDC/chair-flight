import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { UseFormReturn } from "react-hook-form";

const searchConfigSchema = z.object({
  searchField: z.enum(["text", "id", "all"]),
  subject: z.string(),
  course: z.enum([
    "ATPL_A",
    "CPL_A",
    "ATPL_H_IR",
    "ATPL_H_VFR",
    "CPL_H",
    "IR",
    "CBIR_A",
    "all",
  ]),
});

type SearchConfig = z.infer<typeof searchConfigSchema>;

const defaultSearchConfig: z.infer<typeof searchConfigSchema> = {
  searchField: "all",
  subject: "all",
  course: "all",
};

const searchPersistence = {
  "cf-learning-objective-search-atpl": createUsePersistenceHook<SearchConfig>(
    "cf-learning-objective-search-atpl",
  ),
  "cf-learning-objective-search-type": createUsePersistenceHook<SearchConfig>(
    "cf-learning-objective-search-type",
  ),
  "cf-learning-objective-search-prep": createUsePersistenceHook<SearchConfig>(
    "cf-learning-objective-search-prep",
  ),
};

const resolver = zodResolver(searchConfigSchema);

export const useSearchConfig = (
  questionBank: QuestionBankName,
): [SearchConfig, UseFormReturn<SearchConfig>] => {
  const key = `cf-learning-objective-search-${questionBank}` as const;
  const useSearchPersistence = searchPersistence[key];
  const { persistedData, setPersistedData } = useSearchPersistence();
  const defaultValues = persistedData ?? defaultSearchConfig;
  const form = useForm({ defaultValues, resolver });
  const searchField = form.watch("searchField");
  const course = form.watch("course");
  const subject = form.watch("subject");

  useEffect(() => {
    setPersistedData({ searchField, course, subject });
  }, [searchField, course, subject, setPersistedData]);

  return [{ searchField, course, subject }, form];
};
