import { QuestionBank } from "@cf/providers/question-bank";
import { LearningObjectiveSearch } from "@cf/providers/search";
import { SearchLearningObjectivesClient } from "./search-learning-objectives-client";
import type { SearchLearningObjectivesClientProps } from "./search-learning-objectives-client";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

const getData = async (DocBank: QuestionBankName) => {
  const search = LearningObjectiveSearch.get();
  const bank = QuestionBank.get(DocBank);
  return await search.getFilters(bank);
};

export type SearchLearningObjectivesProps = Omit<
  SearchLearningObjectivesClientProps,
  "filters"
>;

export const SearchLearningObjectives: FunctionComponent<
  SearchLearningObjectivesProps
> = async ({ questionBank, ...props }) => {
  const { filters } = await getData(questionBank);
  return (
    <SearchLearningObjectivesClient
      questionBank={questionBank}
      filters={filters}
      {...props}
    />
  );
};
