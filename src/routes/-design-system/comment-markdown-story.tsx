import { CommentMarkdown } from "../../libs/ui/components/community/comment-markdown";
import type { FC } from "react";

const COMMENT = `I think **B** is right too.

# Headings and images are stripped from comments

![image](/images/modules/atpl.png) but [links](https://example.com) stay.`;

export const CommentMarkdownStory: FC = () => (
  <div className="max-w-2xl">
    <CommentMarkdown>{COMMENT}</CommentMarkdown>
  </div>
);
