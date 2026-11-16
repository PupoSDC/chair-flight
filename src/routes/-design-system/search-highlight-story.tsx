import { useState } from "react";
import { Input } from "../../libs/ui/components/base/input";
import { Highlight } from "../../libs/ui/components/base/search-highlight";
import { SearchHighlightContext } from "../../libs/ui/components/base/search-highlight-context";
import type { FC } from "react";

export const SearchHighlightStory: FC = () => {
  const [query, setQuery] = useState("pressure atmosphere");

  return (
    <div className="flex max-w-md flex-col gap-3">
      <Input
        label="Query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <SearchHighlightContext value={query}>
        <p className="m-0 text-sm">
          <Highlight>
            The standard sea level pressure of the atmosphere is 1013.25 hPa.
          </Highlight>
        </p>
      </SearchHighlightContext>
    </div>
  );
};
