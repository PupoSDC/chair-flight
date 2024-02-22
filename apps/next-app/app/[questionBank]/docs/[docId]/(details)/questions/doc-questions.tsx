import { SearchQuestionsList } from "libs/react/containers/src/components/search-questions/search-questions-list";
import { keepUnique } from "@cf/base/utils";
import { QuestionBank } from "@cf/providers/question-bank";
import { QuestionSearch } from "@cf/providers/search";
import type { DocId, QuestionBankName } from "@cf/core/question-bank";
import type { SearchQuestionsListProps } from "libs/react/containers/src/components/search-questions/search-questions-list";
import type { FunctionComponent } from "react";

type DocQuestionsProps = Omit<SearchQuestionsListProps, "items"> & {
  questionBank: QuestionBankName;
  docId: DocId;
};

export const DocQuestions: FunctionComponent<DocQuestionsProps> = async ({
  questionBank,
  docId,
  ...props
}) => {
  const bank = QuestionBank.get(questionBank);
  const search = QuestionSearch.get();
  const doc = await bank.getOne("docs", docId);
  const los = await bank.getSome("learningObjectives", doc.learningObjectives);
  const questionIds = keepUnique(los.flatMap((lo) => lo.nestedQuestions));
  const { items } = await search.retrieve(bank, questionIds);

  return <SearchQuestionsList items={items} {...props} />;
};
