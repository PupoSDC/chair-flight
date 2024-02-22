import { QuestionBank } from "@cf/providers/question-bank";
import { QuestionSearch } from "@cf/providers/search";
import { SearchQuestionsClient } from "./search-questions-client";
import type { SearchQuestionsClientProps } from "./search-questions-client";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

const getData = async (questionBank: QuestionBankName) => {
  const search = QuestionSearch.get();
  const bank = QuestionBank.get(questionBank);
  return await search.getFilters(bank);
};

export type SearchQuestionsProps = Omit<SearchQuestionsClientProps, "filters">;

export const SearchQuestions: FunctionComponent<SearchQuestionsProps> = async ({
  questionBank,
  ...props
}) => {
  const { filters } = await getData(questionBank);
  return (
    <SearchQuestionsClient
      questionBank={questionBank}
      filters={filters}
      {...props}
    />
  );
};
