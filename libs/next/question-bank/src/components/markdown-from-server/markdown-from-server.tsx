import { compileMarkdown } from "@chair-flight/core/markdown";
import { Markdown } from "@chair-flight/react/markdown";
import type { MarkdownProps } from "@chair-flight/react/markdown";
import type { FunctionComponent } from "react";

export type MarkdownFromServerProps = Omit<MarkdownProps, "children"> & {
  children: string;
};

/**
 * WIP this component is just a placeholder. We dont support markdown rendering
 * on the server as of right now. This component is just a shell for that feature
 * whenever it materializes.
 */
export const MarkdownFromServer: FunctionComponent<MarkdownFromServerProps> = ({
  children,
  ...props
}) => {
  return <Markdown {...props}>{compileMarkdown(children)}</Markdown>;
};
