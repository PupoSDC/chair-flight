import { makeMap } from "@cf/base/utils";
import { QuestionBank } from "@cf/providers/question-bank";
import { DocSearch } from "@cf/providers/search";
import { SearchDocsClient } from "./search-docs-client";
import type { SearchDocsClientProps } from "./search-docs-client";
import type { FunctionComponent } from "react";

export type SearchDocsProps = Omit<
  SearchDocsClientProps,
  "filterOptions" | "subjectMap"
>;

export const SearchDocs: FunctionComponent<SearchDocsProps> = async ({
  questionBank,
  ...props
}) => {
  const search = new DocSearch();
  const bank = new QuestionBank(questionBank);
  const { filters } = await search.getFilters(bank);
  const subjectMap = makeMap(
    filters.subject,
    (s) => s.id,
    (s) => s.text,
  );

  return (
    <SearchDocsClient
      questionBank={questionBank}
      filterOptions={filters}
      subjectMap={subjectMap}
      {...props}
    />
  );
};
