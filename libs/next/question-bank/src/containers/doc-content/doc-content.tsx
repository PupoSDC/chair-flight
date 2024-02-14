import { Box, Divider, Link, Typography } from "@mui/joy";
import { Mdx } from "@cf/react/markdown";
import { trpc } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { Container } from "@cf/trpc/client";
import type { AppRouterOutput } from "@cf/trpc/client";

type Props = { questionBank: QuestionBankName; docId: string };
type Params = Props;
type Data = AppRouterOutput["containers"]["docs"]["getDoc"];

export const DocContent: Container<Props, Params, Data> = container<
  Props,
  Params,
  Data
>((props) => {
  const { doc } = DocContent.useData(props);

  return (
    <>
      {!!doc.children.length && (
        <>
          <Box component="ul" sx={{ pl: 2 }}>
            {doc.children.map((child) => (
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
          <Divider />
        </>
      )}
      {!doc.isEmpty && <Mdx children={doc.docMdx} />}
    </>
  );
});

DocContent.displayName = "DocContent";

DocContent.getData = async ({ helper, params }) => {
  const router = helper.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");
  return await router.getDoc.fetch({ questionBank, docId });
};

DocContent.useData = (params) => {
  const router = trpc.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");
  return router.getDoc.useSuspenseQuery({ questionBank, docId })[0];
};
