import { styled } from "@mui/joy";
import { MarkdownClient } from "./markdown-client";
import type { MarkdownClientProps } from "./markdown-client";

/** MarkdownClient styled to remove excessive padding. */
export const MarkdownClientCompressed = styled(MarkdownClient)`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
  }
`;

export type MarkdownClientCompressedProps = MarkdownClientProps;
