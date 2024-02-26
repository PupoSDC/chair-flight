"use client";

import { forwardRef } from "react";
import { useEffect, useState } from "react";
import { NoSsr } from "@mui/base";
import { default as FilterIcon } from "@mui/icons-material/FilterAltOutlined";
import {
  Select,
  Stack,
  selectClasses,
  styled,
  Option,
  IconButton,
} from "@mui/joy";
import {
  Badge,
  Button,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { useDisclose } from "../../hooks/use-disclose";
import { SearchQuery } from "../search-query";

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
  mobileBreakpoint?: "sm" | "md" | "lg" | "xl" | "force-mobile";
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
    const filterModal = useDisclose();
    const [activeFilters, setActiveFilters] = useState(0);

    useEffect(() => {
      const numberOfActiveFilters = Object.values(filterValues).filter(
        (v) => v !== "all",
      ).length;
      setActiveFilters(numberOfActiveFilters);
    }, [filterValues]);

    const filterJsx = Object.entries(filters).map(([name, options]) => (
      <Select
        key={name}
        size="sm"
        value={filterValues[name]}
        onChange={(_, value) => {
          onFilterValuesChange(name, value ?? "all");
          filterModal.close();
        }}
      >
        {options.map((o) => (
          <Option key={o.id} value={o.id}>
            {o.text}
          </Option>
        ))}
      </Select>
    ));

    const fallbackJsx = Object.keys(filters).map((name) => (
      <Select key={name} size="sm" value={filterValues[name]} />
    ));

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
        <Stack
          direction={"row"}
          gap={1}
          sx={{ display: { xs: "none", [mobileBreakpoint]: "flex" } }}
        >
          <NoSsr fallback={fallbackJsx}>{filterJsx}</NoSsr>
        </Stack>
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={filterModal.open}
          sx={{ display: { [mobileBreakpoint]: "none" } }}
        >
          <Badge
            badgeContent={activeFilters}
            size="sm"
            sx={{ zIndex: 1000 }}
            anchorOrigin={{ horizontal: "left", vertical: "top" }}
          >
            <FilterIcon />
          </Badge>
        </IconButton>
        <Modal open={filterModal.isOpen} onClose={filterModal.close}>
          <ModalDialog aria-labelledby="filter-modal">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack gap={2} onChange={filterModal.close}>
              {filterJsx}
            </Stack>
            <Button color="primary" onClick={filterModal.close}>
              Submit
            </Button>
          </ModalDialog>
        </Modal>
      </SearchHeaderContainer>
    );
  },
);

SearchHeader.displayName = "SearchHeader";
