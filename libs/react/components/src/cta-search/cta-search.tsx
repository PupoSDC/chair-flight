import { forwardRef, useEffect, useRef, useState } from "react";
import { mergeRefs } from "react-merge-refs";
import { default as SearchIcon } from "@mui/icons-material/Search";
import {
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import type { InputProps } from "@mui/joy";

export type CtaSearchProps = {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  numberOfResults?: number;
} & Omit<
  InputProps,
  | "value"
  | "onChange"
  | "startDecorator"
  | "endDecorator"
  | "size"
  | "fullWidth"
>;

/**
 * A search box to interact with our search API.
 *
 * It uses a debounce to avoid sending too many requests to the API, and displays
 * a fake loading spinner as soon as the user starts typing.
 */
export const CtaSearch = forwardRef<HTMLInputElement, CtaSearchProps>(
  ({ value, onChange, loading, sx, numberOfResults, ...props }, ref) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const mergedRef = mergeRefs([ref, inputRef]);
    const [search, setSearch] = useState<string>(value);
    const [isDebouncing, setIsDebouncing] = useState(false);

    useEffect(function focusInputAfterMount() {
      if (!inputRef.current) return;
      inputRef.current.getElementsByTagName("input")[0].focus();
    }, []);

    useEffect(
      function callbackWitDebounce() {
        if (search === value) return;
        const timer = setTimeout(() => {
          onChange(search);
        }, 200);
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
      <FormControl
        sx={{
          maxWidth: 600,
          width: "100%",
          mt: 2,
          ...sx,
        }}
      >
        <Input
          type="search"
          role="search"
          {...props}
          ref={mergedRef}
          value={search}
          size="lg"
          onChange={(e) => {
            setIsDebouncing(true);
            setSearch(e.target.value);
          }}
          startDecorator={
            isLoading ? <CircularProgress size="sm" /> : <SearchIcon />
          }
        />
        <FormLabel sx={{ ml: "auto", pr: 1 }}>
          {numberOfResults && (
            <Typography level="body4">
              Number of Results: {numberOfResults}
            </Typography>
          )}
        </FormLabel>
      </FormControl>
    );
  },
);

CtaSearch.displayName = "CtaSearch";
