import { QuestionBank } from "@cf/providers/question-bank";
import { AnnexSearch } from "@cf/providers/search";
import { SearchAnnexesClient } from "./search-annexes-client";
import type { SearchAnnexesClientProps } from "./search-annexes-client";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

const getData = async (questionBank: QuestionBankName) => {
  const search = AnnexSearch.get();
  const bank = QuestionBank.get(questionBank);
  return await search.getFilters(bank);
};

export type SearchAnnexesProps = Omit<SearchAnnexesClientProps, "filters">;

export const SearchAnnexes: FunctionComponent<SearchAnnexesProps> = async ({
  questionBank,
  ...props
}) => {
  const { filters } = await getData(questionBank);
  return (
    <SearchAnnexesClient
      questionBank={questionBank}
      filters={filters}
      {...props}
    />
  );
};
