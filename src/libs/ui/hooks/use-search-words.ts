import { useContext } from "react";
import { SearchHighlightContext } from "../components/base/search-highlight-context";

export const useSearchWords = () => {
  const query = useContext(SearchHighlightContext);
  return query
    .split(/\s+/)
    .filter((word) => word.length > 1)
    .slice(0, 8);
};
