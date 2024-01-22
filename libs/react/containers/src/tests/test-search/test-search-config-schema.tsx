import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { UseFormReturn } from "react-hook-form";

const searchConfigSchema = z.object({
  mode: z.enum(["all", "study", "exam"]).default("all"),
  status: z.enum(["all", "created", "started", "finished"]).default("all"),
});

type SearchConfig = z.infer<typeof searchConfigSchema>;

const defaultSearchConfig = searchConfigSchema.parse({});

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-test-search-atpl", defaultSearchConfig),
  type: createUsePersistenceHook("cf-test-search-type", defaultSearchConfig),
  prep: createUsePersistenceHook("cf-test-search-prep", defaultSearchConfig),
};

const resolver = zodResolver(searchConfigSchema);

export const useSearchConfig = (questionBank: QuestionBankName) => {
  const { getData, setData } = useSearchPersistence[questionBank]();
  const form = useForm({ defaultValues: getData(), resolver });
  useEffect(() => () => setData(form.getValues()), []);
  return form;
};
