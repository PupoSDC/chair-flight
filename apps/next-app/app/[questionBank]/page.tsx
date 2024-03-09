import { redirect } from "next/navigation";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type PageProps = {
  params: {
    questionBank: QuestionBankName;
  };
};

const Page: FunctionComponent<PageProps> = ({ params: { questionBank } }) => {
  console.log(questionBank);
  redirect(`/${questionBank}/questions`);
};

export default Page;
