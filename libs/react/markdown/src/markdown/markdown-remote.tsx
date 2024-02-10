import { Box } from "@mui/joy";
import type { BoxProps } from "@mui/joy";
import type { FunctionComponent } from "react";

type CompiledMarkdown = { __html: string };

type MarkdownRemoteProps = {
  children: CompiledMarkdown;
} & Omit<BoxProps, "children">;

/**
 * Renders markdown previously compiled on the server.
 *
 *
 */
export const MarkdownRemote: FunctionComponent<MarkdownRemoteProps> = ({
  children,
  ...otherProps
}) => <Box dangerouslySetInnerHTML={children} {...otherProps} />;
