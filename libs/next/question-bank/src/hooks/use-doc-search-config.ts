import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { docSearchFilters } from "@chair-flight/core/search";
import { createUsePersistenceHook } from "@chair-flight/react/components";
import type { QuestionBankName } from "@chair-flight/core/question-bank";

const defaultFilter = docSearchFilters.parse({});
const resolver = zodResolver(docSearchFilters);

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-docs-search-atpl", defaultFilter),
  type: createUsePersistenceHook("cf-docs-search-type", defaultFilter),
  prep: createUsePersistenceHook("cf-docs-search-prep", defaultFilter),
};

export const useDocSearchConfig = ({
  questionBank,
}: {
  questionBank: QuestionBankName;
}) => {
  const persistedData = useSearchPersistence[questionBank]();
  const defaultValues = persistedData.getData();
  const form = useForm({ defaultValues, resolver });

  form.watch((data) => persistedData.setData({ ...defaultFilter, ...data }));

  return form;
};
