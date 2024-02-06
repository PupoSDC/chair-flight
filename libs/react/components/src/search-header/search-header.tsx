import { forwardRef } from "react";
import { Select, Stack, selectClasses, styled, Option } from "@mui/joy";
import { SearchFilters } from "../search-filters";
import { SearchQuery } from "../search-query";
import type { SearchFiltersProps } from "../search-filters/search-filters";

const SearchHeaderContainer = styled(Stack)`
  gap: ${({ theme }) => theme.spacing(1)};
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(1)};

  .${selectClasses.root} {
    width: 13em;
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`;

export type SearchHeaderProps = {
  search: string;
  searchPlaceholder?: string;
  filters: Record<string, Array<{ id: string; text: string }>>;
  filterValues: Record<string, string>;
  isLoading: boolean;
  isError: boolean;
  mobileBreakpoint?: SearchFiltersProps["mobileBreakpoint"] | "force-mobile";
  onSearchChange: (value: string) => void;
  onFilterValuesChange: (name: string, value: string) => void;
};

export const SearchHeader = forwardRef<HTMLDivElement, SearchHeaderProps>(
  (
    {
      search,
      searchPlaceholder = "Search...",
      filters,
      filterValues,
      isLoading,
      isError,
      mobileBreakpoint = "md",
      onSearchChange,
      onFilterValuesChange,
    },
    ref,
  ) => {
    const numberOfFilters = Object.values(filterValues).filter(
      (v) => v !== "all",
    ).length;

    return (
      <SearchHeaderContainer ref={ref}>
        <SearchQuery
          size="sm"
          value={search}
          loading={isLoading}
          error={isError}
          onChange={onSearchChange}
          sx={{ flex: 1 }}
          placeholder={searchPlaceholder}
        />
        <SearchFilters
          activeFilters={numberOfFilters}
          mobileBreakpoint={mobileBreakpoint}
          fallback={Object.keys(filters).map((name) => (
            <Select key={name} size="sm" value={filterValues[name]} />
          ))}
          filters={Object.entries(filters).map(([name, options]) => (
            <Select
              key={name}
              size="sm"
              value={filterValues[name]}
              onChange={(_, value) =>
                onFilterValuesChange(name, value ?? "all")
              }
            >
              {options.map((o) => (
                <Option key={o.id} value={o.id}>
                  {o.text}
                </Option>
              ))}
            </Select>
          ))}
        />
      </SearchHeaderContainer>
    );
  },
);

SearchHeader.displayName = "SearchHeader";
