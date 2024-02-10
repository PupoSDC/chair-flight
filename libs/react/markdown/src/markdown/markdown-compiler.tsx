import { renderToString } from "react-dom/server";
import { MarkdownClient } from "./markdown-local";

/**
 * Server side function to render markdown to HTML so that it can be
 * rendered on the client using `<MarkdownServer />`
 */
export const renderMarkdown = (children: string) => {
  const __html = renderToString(<MarkdownClient children={children} />);
  return { __html };
};
