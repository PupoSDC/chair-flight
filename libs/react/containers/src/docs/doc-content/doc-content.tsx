import { Link, Typography } from "@mui/joy";
import { Markdown } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import type { Container } from "../../wraper/container";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = { questionBank: QuestionBankName; docId: string };
type Params = Props;
type Data = AppRouterOutput["containers"]["docs"]["getDocContent"];

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
          <Typography level="h2" component="h2">
            Children
          </Typography>
          <ul>
            {doc.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  color={child.isEmpty ? "neutral" : "primary"}
                  sx={{ textDecoration: child.isEmpty ? "line-through" : "" }}
                >
                  {child.title}
                  {child.isEmpty && ` (empty)`}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      {!doc.isEmpty && <Markdown document={doc.docMdx} />}
    </>
  );
});

DocContent.displayName = "DocContent";

DocContent.getData = async ({ helper, params }) => {
  const router = helper.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");
  return await router.getDocContent.fetch({ questionBank, docId });
};

DocContent.useData = (params) => {
  const router = trpc.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");
  return router.getDocContent.useSuspenseQuery({ questionBank, docId })[0];
};
