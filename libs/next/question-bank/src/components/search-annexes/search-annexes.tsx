import { QuestionBank } from "@cf/providers/question-bank";
import { AnnexSearch } from "@cf/providers/search";
import { SearchAnnexesClient } from "./search-annexes-client";
import type { SearchAnnexesClientProps } from "./search-annexes-client";
import type { FunctionComponent } from "react";

export type SearchAnnexesProps = Omit<
  SearchAnnexesClientProps,
  "filterOptions"
>;

export const SearchAnnexes: FunctionComponent<SearchAnnexesProps> = async ({
  questionBank,
  ...props
}) => {
  const search = new AnnexSearch();
  const bank = new QuestionBank(questionBank);
  const { filters } = await search.getFilters(bank);

  return (
    <SearchAnnexesClient
      questionBank={questionBank}
      filterOptions={filters}
      {...props}
    />
  );
};
