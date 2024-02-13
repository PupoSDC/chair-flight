import { compileMarkdown } from "@cf/core/markdown";
import { Markdown } from "@cf/react/markdown";
import type { MarkdownProps } from "@cf/react/markdown";
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
