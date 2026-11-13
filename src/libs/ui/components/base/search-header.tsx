import { useEffect, useState } from "react";
import { Input } from "./input";
import { Select } from "./select";
import type { FC } from "react";

export type SearchSelect = {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
};

export const SearchHeader: FC<{
  placeholder: string;
  query: string;
  selects: SearchSelect[];
  onChange: (name: string, value: string) => void;
}> = ({ placeholder, query, selects, onChange }) => {
  const [draft, setDraft] = useState(query);

  useEffect(() => {
    if (draft === query) return;
    const timeout = setTimeout(() => onChange("q", draft), 300);
    return () => clearTimeout(timeout);
  }, [draft, query, onChange]);

  return (
    <div className="flex flex-none flex-wrap gap-2 p-3">
      <div className="min-w-48 flex-1 max-sm:basis-full">
        <Input
          label="Search"
          hideLabel
          type="search"
          placeholder={placeholder}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </div>
      {selects.map((select) => (
        <div key={select.name} className="w-36 max-sm:flex-1">
          <Select
            label={select.label}
            hideLabel
            placeholder={select.label}
            value={select.value}
            options={select.options}
            onChange={(event) => onChange(select.name, event.target.value)}
          />
        </div>
      ))}
    </div>
  );
};
