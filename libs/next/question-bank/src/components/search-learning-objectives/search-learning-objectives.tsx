import { QuestionBank } from "@cf/providers/question-bank";
import { LearningObjectiveSearch } from "@cf/providers/search";
import { SearchLearningObjectivesClient } from "./search-learning-objectives-client";
import type { SearchLearningObjectivesClientProps } from "./search-learning-objectives-client";
import type { FunctionComponent } from "react";

export type SearchLearningObjectivesProps = Omit<
  SearchLearningObjectivesClientProps,
  "filterOptions"
>;

export const SearchLearningObjectives: FunctionComponent<
  SearchLearningObjectivesProps
> = async ({ questionBank, ...props }) => {
  const search = new LearningObjectiveSearch();
  const bank = new QuestionBank(questionBank);
  const { filters } = await search.getFilters(bank);

  return (
    <SearchLearningObjectivesClient
      questionBank={questionBank}
      filterOptions={filters}
      {...props}
    />
  );
};
