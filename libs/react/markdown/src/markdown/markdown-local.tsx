import type { FunctionComponent } from "react";
import { default as ReactMarkdown } from "react-markdown";
import type { BoxProps } from "@mui/joy";
import { Box } from "@mui/joy";
import { plugins } from "../common/plugins";
import { markdownComponents } from "./markdown-components";

export type MarkdownClientProps = {
  children: string;
} & Omit<BoxProps, "children">;

/**
 * Renders markdown based on a string on the Client.
 *
 * Downsides: using this component requires to download quite a few plugins
 * increasing the bundle size significantly.
 */
export const MarkdownClient: FunctionComponent<MarkdownClientProps> = ({
  children,
  ...otherProps
}) => (
  <Box {...otherProps}>
    <ReactMarkdown
      {...plugins}
      children={children}
      components={markdownComponents}
    />
  </Box>
);
