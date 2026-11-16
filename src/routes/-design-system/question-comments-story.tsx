import { QuestionComments } from "../../libs/ui/components/community/question-comments";
import type { FC } from "react";

export const QuestionCommentsStory: FC = () => (
  <div className="max-w-2xl">
    <p className="m-0 mb-3 text-xs text-muted">
      Loaded from the real comments backend, so it shows an error when that is
      not reachable.
    </p>
    <QuestionComments questionBank="atpl" questionId="design-system" />
  </div>
);
