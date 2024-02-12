import { Markdown, useThrottle } from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import type { MarkdownProps } from "@chair-flight/react/components";
import type { FunctionComponent } from "react";

const useMarkdown = trpc.common.markdown.getRenderedMarkdown.useQuery;

export type MarkdownFromServerProps = Omit<MarkdownProps, "children"> & {
  children: string;
};

export const MarkdownFromServer: FunctionComponent<MarkdownFromServerProps> = ({
  children,
  ...props
}) => {
  const markdown = useThrottle(children, 150);
  const { data } = useMarkdown({ markdown });

  if (!data) return null;
  return <Markdown {...props}>{data?.markdownDocument}</Markdown>;
};
