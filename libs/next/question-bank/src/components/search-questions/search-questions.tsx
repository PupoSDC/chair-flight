import { QuestionBank } from "@cf/providers/question-bank";
import { QuestionSearch } from "@cf/providers/search";
import { SearchQuestionsClient } from "./search-questions-client";
import type { SearchQuestionsClientProps } from "./search-questions-client";
import type { FunctionComponent } from "react";

export type SearchQuestionsProps = Omit<
  SearchQuestionsClientProps,
  "filterOptions"
>;

export const SearchQuestions: FunctionComponent<SearchQuestionsProps> = async ({
  questionBank,
  ...props
}) => {
  const search = new QuestionSearch();
  const bank = new QuestionBank(questionBank);
  const { filters } = await search.getFilters(bank);
  return (
    <SearchQuestionsClient
      questionBank={questionBank}
      filterOptions={filters}
      {...props}
    />
  );
};
