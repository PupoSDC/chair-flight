import { useMemo } from "react";
import Head from "next/head";
import * as mdx from "@mdx-js/react";
import { GlobalStyles, Link, Typography } from "@mui/joy";
import { markdownComponents } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import { jsxRuntime } from "./jsx-runtime.cjs";
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

  const Content: React.ElementType = useMemo(() => {
    // if we're ready to render, we can assemble the component tree and let React do its thing
    // first we set up the scope which has to include the mdx custom
    // create element function as well as any components we're using
    const fullScope = Object.assign({
      opts: {
        ...mdx,
        ...jsxRuntime,
        jsxs: jsxRuntime.jsxs || jsxRuntime.jsxDEV,
        jsx: jsxRuntime.jsx || jsxRuntime.jsxDEV,
      },
    });

    const keys = Object.keys(fullScope);
    const values = Object.values(fullScope);

    // now we eval the source code using a function constructor
    // in order for this to work we need to have React, the mdx createElement,
    // and all our components in scope for the function, which is the case here
    // we pass the names (via keys) in as the function's args, and execute the
    // function with the actual values.
    const hydrateFn = Reflect.construct(
      Function,
      keys.concat(`${doc.mdxSource}`),
    );

    return hydrateFn.apply(hydrateFn, values).default;
  }, [doc.mdxSource]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
      </Head>
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
        <mdx.MDXProvider components={markdownComponents}>
          <Content />
        </mdx.MDXProvider>
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
