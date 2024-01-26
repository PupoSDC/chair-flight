import { MDXRemote } from "next-mdx-remote";
import { GlobalStyles, Link, Typography } from "@mui/joy";
import { markdownComponents } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import type { Container } from "../../wraper/container";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = {
  questionBank: QuestionBankName;
  docId: string;
};

type Params = {
  questionBank: QuestionBankName;
  docId: string;
};

type Data = AppRouterOutput["questionBankDocs"]["getDoc"];

export const DocContent: Container<Props, Params, Data> = container<
  Props,
  Params,
  Data
>((props) => {
  const { doc } = DocContent.useData(props);
  return (
    <>
      <GlobalStyles
        styles={{
          main: {
            "h1, h2, h3, h4, h5": { marginTop: "1em" },
          },
        }}
      />
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
      {!doc.isEmpty && (
        <MDXRemote
          {...doc.mdxSource}
          components={{
            ...markdownComponents,
          }}
        />
      )}
    </>
  );
});

DocContent.displayName = "DocContent";

DocContent.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");

  return await helper.questionBankDocs.getDoc.fetch({
    questionBank,
    docId,
  });
};

DocContent.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");

  return trpc.questionBankDocs.getDoc.useSuspenseQuery({
    questionBank,
    docId,
  })[0];
};
