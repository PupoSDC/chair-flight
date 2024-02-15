import { default as ReactMarkdown } from "react-markdown";
import { Box } from "@mui/joy";
import { markdownPlugins, type MdDocument } from "@cf/core/markdown";
import { markdownComponents } from "../../common/components";
import type { BoxProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type MarkdownProps = {
  children: MdDocument;
  compressed?: boolean;
  color?: "primary" | "neutral" | "warning" | "success" | "danger";
} & Omit<BoxProps, "children" | "color">;

/**
 * Renders **markdown** on the client.
 */
export const Markdown: FunctionComponent<MarkdownProps> = ({
  children,
  compressed,
  sx,
  color,
  ...otherProps
}) => (
  <Box
    {...otherProps}
    sx={{
      ...(color && {
        "&, & h1, & h2, & h3, & h4, & h5, & h6, & p": {
          color: (t) => `rgb(${t.vars.palette[color].mainChannel})`,
        },
      }),

      ...(compressed && {
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          margin: 0,
          fontSize: "md",
        },

        "& p": {
          margin: 0,
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
