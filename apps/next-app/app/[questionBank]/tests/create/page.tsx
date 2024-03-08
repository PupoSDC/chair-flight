import { TestMaker } from "@cf/next/tests";
import { ModulesMain } from "@cf/next/ui";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type PageProps = {
  params: {
    questionBank: QuestionBankName;
  };
};

const Page: FunctionComponent<PageProps> = ({ params }) => {
  const { questionBank } = params;

  return (
    <ModulesMain fixedHeight>
      <TestMaker
        questionBank={questionBank}
        sx={{ height: "100%", maxWidth: "md", mx: "auto" }}
      />
    </ModulesMain>
  );
};

export default Page;
