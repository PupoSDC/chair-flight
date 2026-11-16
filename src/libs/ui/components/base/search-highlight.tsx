import { getHighlightRegExp } from "../../../base/get-highlight-reg-exp";
import { useSearchWords } from "../../hooks/use-search-words";
import type { FC, ReactNode } from "react";

export const Highlight: FC<{ children: string }> = ({ children }) => {
  const pattern = getHighlightRegExp(useSearchWords());
  if (!pattern) return children;
  let offset = 0;
  const parts: ReactNode[] = children.split(pattern).map((part, index) => {
    const start = offset;
    offset += part.length;
    return index % 2 === 1 ? (
      <mark key={start} className="rounded-sm bg-warning/40 text-inherit">
        {part}
      </mark>
    ) : (
      part
    );
  });
  return <>{parts}</>;
};
