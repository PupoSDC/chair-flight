import { makeMap } from "@cf/base/utils";
import { QuestionBank } from "@cf/providers/question-bank";
import { DocSearch } from "@cf/providers/search";
import { SearchDocsClient } from "./search-docs-client";
import type { SearchDocsClientProps } from "./search-docs-client";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

const getData = async (DocBank: QuestionBankName) => {
  const search = DocSearch.get();
  const bank = QuestionBank.get(DocBank);
  const { filters } = await search.getFilters(bank);
  const subjectMap = makeMap(
    filters.subject,
    (s) => s.id,
    (s) => s.text,
  );
  return { filters, subjectMap };
};

export type SearchDocsProps = Omit<
  SearchDocsClientProps,
  "filters" | "subjectMap"
>;

export const SearchDocs: FunctionComponent<SearchDocsProps> = async ({
  questionBank,
  ...props
}) => {
  const { filters, subjectMap } = await getData(questionBank);
  return (
    <SearchDocsClient
      questionBank={questionBank}
      filters={filters}
      subjectMap={subjectMap}
      {...props}
    />
  );
};
