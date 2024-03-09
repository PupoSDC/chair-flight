import { Divider, Link, Typography } from "@mui/joy";
import { QuestionBank } from "@cf/providers/question-bank";
import type { DocId, QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent } from "react";

type Props = {
  params: {
    docId: DocId;
    questionBank: QuestionBankName;
  };
};

const Page: FunctionComponent<Props> = async ({ params }) => {
  const questionBank = new QuestionBank(params.questionBank);
  const doc = await questionBank.getOne("docs", params.docId);

  const parent = doc.parentId
    ? await questionBank.getOne("docs", doc.parentId)
    : undefined;

  const parentDoc = parent && {
    href: `/${params.questionBank}/docs/${parent.id}`,
    title: `[${parent.id}] ${parent.title}`,
  };

  return (
    <>
      {parentDoc && <Link href={parentDoc.href} children={parentDoc.title} />}
      <Typography
        level="h3"
        component="h1"
        sx={{ fontWeight: "bold" }}
        children={`[${doc.id}] ${doc.title}`}
      />
      <Divider sx={{ width: "100%", my: 1 }} />
    </>
  );
};

export default Page;
