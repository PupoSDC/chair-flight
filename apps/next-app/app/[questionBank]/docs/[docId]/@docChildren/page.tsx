import { Box, Divider, Link } from "@mui/joy";
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
  const children = await questionBank.getSome("docs", doc.docs);

  const childrenDocs = children.map((child) => ({
    href: `/${params.questionBank}/docs/${child.id}`,
    title: `[${child.id}] ${child.title}`,
    isEmpty: child.empty,
  }));

  return (
    <>
      {!!childrenDocs.length && (
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          {childrenDocs.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                color={child.isEmpty ? "neutral" : "primary"}
              >
                {child.title}
                {child.isEmpty && ` (empty)`}
              </Link>
            </li>
          ))}
        </Box>
      )}
      {!!childrenDocs.length && <Divider sx={{ my: 2 }} />}
    </>
  );
};

export default Page;
