import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSearchFilters } from "@chair-flight/core/search";
import { createUsePersistenceHook } from "@chair-flight/react/components";
import type { QuestionBankName } from "@chair-flight/core/question-bank";

const defaultFilter = questionSearchFilters.parse({});
const resolver = zodResolver(questionSearchFilters);

const useSearchPersistence = {
  atpl: createUsePersistenceHook("cf-question-search-atpl", defaultFilter),
  type: createUsePersistenceHook("cf-question-search-type", defaultFilter),
  prep: createUsePersistenceHook("cf-question-search-prep", defaultFilter),
};

export const useQuestionSearchConfig = ({
  questionBank,
}: {
  questionBank: QuestionBankName;
}) => {
  const persistedData = useSearchPersistence[questionBank]();

  const form = useForm({
    defaultValues: persistedData.getData(),
    resolver,
  });

  form.watch((data) => persistedData.setData({ ...defaultFilter, ...data }));

  return form;
};
