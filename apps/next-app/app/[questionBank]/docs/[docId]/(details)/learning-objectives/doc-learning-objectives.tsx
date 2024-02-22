import { keepUnique } from "@cf/base/utils";
import { QuestionBank } from "@cf/providers/question-bank";
import { LearningObjectiveSearch, QuestionSearch } from "@cf/providers/search";
import { SearchLearningObjectivesList } from "@cf/react/containers";
import type { DocId, QuestionBankName } from "@cf/core/question-bank";
import type { SearchLearningObjectivesListProps } from "@cf/react/containers";
import type { FunctionComponent } from "react";

type DocLearningObjectivesProps = Omit<
  SearchLearningObjectivesListProps,
  "items"
> & {
  questionBank: QuestionBankName;
  docId: DocId;
};

export const DocLearningObjectives: FunctionComponent<
  DocLearningObjectivesProps
> = async ({ questionBank, docId, ...props }) => {
  const bank = QuestionBank.get(questionBank);
  const search = LearningObjectiveSearch.get();
  const doc = await bank.getOne("docs", docId);
  const los = await bank.getSome("learningObjectives", doc.learningObjectives);
  // recursively get all learning objectives
  for (const lo of los) {
    const children = await bank.getSome(
      "learningObjectives",
      lo.learningObjectives,
    );
    los.push(...children);
  }
  const loIds = keepUnique(los)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((lo) => lo.id);
  const { items } = await search.retrieve(bank, loIds);
  return <SearchLearningObjectivesList items={items} {...props} />;
};
