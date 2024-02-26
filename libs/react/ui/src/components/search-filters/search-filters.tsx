"use client";

import { useEffect, useState } from "react";
import { NoSsr } from "@mui/base";
import { default as FilterIcon } from "@mui/icons-material/FilterAltOutlined";
import {
  Badge,
  Button,
  Divider,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { useDisclose } from "../../hooks/use-disclose";
import type { FC, ReactNode } from "react";

export type SearchFiltersProps = {
  filters: ReactNode;
  fallback: ReactNode;
  activeFilters: number;
  mobileBreakpoint?: "sm" | "md" | "lg" | "xl" | "force-mobile";
};

/**
 * @deprecated Replaced by search header.
 *
 * Opinionated component to display search filters. Includes a `NoSsr`boundary
 * to make it safe to render when filter information is persisted client side.
 *
 * Provided `fallback`should closely mirror `filters`.
 */
export const SearchFilters: FC<SearchFiltersProps> = ({
  filters,
  fallback,
  activeFilters,
  mobileBreakpoint = "md",
}) => {
  const filterModal = useDisclose();
  const [deferredActiveFilters, setDeferredActiveFilters] = useState(0);

  useEffect(() => setDeferredActiveFilters(activeFilters), [activeFilters]);

  return (
    <>
      <Stack
        direction={"row"}
        gap={1}
        sx={{ display: { xs: "none", [mobileBreakpoint]: "flex" } }}
      >
        <NoSsr fallback={fallback}>{filters}</NoSsr>
      </Stack>
      <IconButton
        size="sm"
        variant="outlined"
        color="neutral"
        onClick={filterModal.open}
        sx={{ display: { [mobileBreakpoint]: "none" } }}
      >
        <Badge badgeContent={deferredActiveFilters} size="sm">
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
            {filters}
          </Stack>
          <Button color="primary" onClick={filterModal.close}>
            Submit
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};
