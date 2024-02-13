import { default as ReactMarkdown } from "react-markdown";
import { Box } from "@mui/joy";
import { markdownPlugins, type MdDocument } from "@chair-flight/core/markdown";
import { markdownComponents } from "../../common/components";
import type { BoxProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type MarkdownProps = {
  children: MdDocument;
  compressed?: boolean;
} & Omit<BoxProps, "children">;

/**
 * Renders **markdown** on the client.
 */
export const Markdown: FunctionComponent<MarkdownProps> = ({
  children,
  compressed,
  sx,
  ...otherProps
}) => (
  <Box
    {...otherProps}
    sx={{
      ...(compressed && {
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          margin: 0,
          fontSize: "md",
        },

        "& p": {
          fontSize: "sm",
        },

        "& ul": {
          margin: 0,
          paddingLeft: "16px",
        },

        "& li": {
          fontSize: "xs",
        },
      }),
      ...sx,
    }}
  >
    <ReactMarkdown
      {...markdownPlugins}
      components={markdownComponents}
      children={children.mdContent}
    />
  </Box>
);
