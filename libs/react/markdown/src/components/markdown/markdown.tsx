import { default as ReactMarkdown } from "react-markdown";
import { Box } from "@mui/joy";
import { markdownComponents } from "../../common/components";
import type { MdDocument } from "@chair-flight/core/markdown";
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
    sx={{
      ...(compressed && {
        "& h1, & h2, & h3, & h4, & h5, & h6, & p": {
          margin: 0,
        },
        "& ul": {
          margin: 0,
          paddingLeft: "16px",
        },
      }),
      ...sx,
    }}
  >
    <ReactMarkdown
      dangerouslySetInnerHTML={children}
      components={markdownComponents}
      {...otherProps}
    />
  </Box>
);
