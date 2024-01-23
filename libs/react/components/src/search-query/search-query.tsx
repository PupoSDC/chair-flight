import { forwardRef, useEffect, useState } from "react";
import { default as SearchIcon } from "@mui/icons-material/Search";
import { CircularProgress, Input } from "@mui/joy";
import type { InputProps } from "@mui/joy";

export type SearchQueryProps = {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  disableLabel?: boolean;
} & Omit<InputProps, "value" | "onChange" | "startDecorator">;

/**
 * A search box to interact with our search API.
 *
 * It uses a debounce to avoid sending too many requests to the API, and displays
 * a fake loading spinner as soon as the user starts typing.
 */
export const SearchQuery = forwardRef<HTMLInputElement, SearchQueryProps>(
  (
    {
      value,
      onChange,
      loading,
      sx,
      disableLabel,
      type = "search",
      role = "search",
      size = "lg",
      ...props
    },
    ref,
  ) => {
    const [search, setSearch] = useState<string>(value);
    const [isDebouncing, setIsDebouncing] = useState(false);

    useEffect(
      function callbackWitDebounce() {
        if (search === value) return;
        const timer = setTimeout(() => {
          onChange(search);
        }, 350);
        return () => {
          clearTimeout(timer);
        };
      },
      [value, search, onChange],
    );

    useEffect(
      function cancelLoadStateWhenInSync() {
        if (value === search) {
          setIsDebouncing(false);
        }
      },
      [value, search],
    );

    const isLoading = isDebouncing || loading;

    return (
      <Input
        {...props}
        ref={ref}
        type={type}
        role={role}
        size={size}
        value={search}
        sx={sx}
        onChange={(e) => {
          setIsDebouncing(true);
          setSearch(e.target.value);
        }}
        startDecorator={
          isLoading ? <CircularProgress size="sm" /> : <SearchIcon />
        }
      />
    );
  },
);

SearchQuery.displayName = "SearchQuery";
