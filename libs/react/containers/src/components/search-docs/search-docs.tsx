import { makeMap } from "@cf/base/utils";
import { QuestionBank } from "@cf/providers/question-bank";
import { DocSearch } from "@cf/providers/search";
import { SearchDocsClient } from "./search-docs-client";
import type { SearchDocsClientProps } from "./search-docs-client";
import type { FunctionComponent } from "react";

export type SearchDocsProps = Omit<
  SearchDocsClientProps,
  "filters" | "subjectMap"
>;

export const SearchDocs: FunctionComponent<SearchDocsProps> = async ({
  questionBank,
  ...props
}) => {
  const search = DocSearch.get();
  const bank = QuestionBank.get(questionBank);

  const { filters } = await search.getFilters(bank);

  const subjectMap = makeMap(
    filters.subject,
    (s) => s.id,
    (s) => s.text,
  );

  return (
    <SearchDocsClient
      questionBank={questionBank}
      filters={filters}
      subjectMap={subjectMap}
      {...props}
    />
  );
};
