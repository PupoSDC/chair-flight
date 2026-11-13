import { createContext, useContext } from "react";
import type { FC, ReactNode } from "react";

const SearchHighlightContext = createContext("");

export const SearchHighlightProvider = SearchHighlightContext.Provider;

export const useSearchWords = () => {
  const query = useContext(SearchHighlightContext);
  return query
    .split(/\s+/)
    .filter((word) => word.length > 1)
    .slice(0, 8);
};

export const getHighlightRegExp = (words: string[]) =>
  words.length === 0
    ? null
    : new RegExp(
        `(${words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
        "gi",
      );

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
