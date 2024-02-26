import { QuestionBankName } from "@cf/core/question-bank";
import { QuestionBank } from "@cf/providers/question-bank";
import { QuestionSearch } from "@cf/providers/search";
import { FunctionComponent } from "react";


type QuestionSearchPageProps = {
  params: { questionBank: QuestionBankName; }
}

const QuestionSearchPage : FunctionComponent<QuestionSearchPageProps> = async ({
  params
}) => {
  const search = QuestionSearch.get();
  const bank = QuestionBank.get(params.questionBank);
  const { filters } = await search.getFilters(bank);

  return (
    <>
    </>
  )
}

export default QuestionSearchPage;
