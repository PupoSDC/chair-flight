import { Fragment, useRef } from "react";
import { NoSsr } from "@mui/base";
import {
  Box,
  List,
  ListDivider,
  ListItem,
  Sheet,
  Skeleton,
  Table,
  useTheme,
} from "@mui/joy";
import { useMediaQuery } from "../hooks/use-media-query";
import { Ups } from "../ups";
import type { SheetProps } from "@mui/joy";
import type { FunctionComponent } from "react";

const LoadingPlaceholder: FunctionComponent = () => (
  <Box sx={{ height: "100%", p: 2 }} gap={1}>
    <Box sx={{ overflow: "hidden", height: "100%" }}>
      {[...new Array(20).keys()].map((k) => (
        <Skeleton
          key={k}
          variant="rectangular"
          height={"48px"}
          sx={{ my: 1 }}
        />
      ))}
    </Box>
  </Box>
);

export type SearchListProps<T extends { id: string }> = {
  items?: T[];
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  noDataMessage?: string;
  forceMode?: "mobile" | "desktop";
  /** Should return a `<thead />`  */
  renderThead: FunctionComponent;
  /** Should return a `<tr />` */
  renderTableRow: FunctionComponent<T>;
  /** Should return a `<ListItemContent />` */
  renderListItemContent: FunctionComponent<T>;
  onFetchNextPage?: () => Promise<unknown>;
} & SheetProps;

export const SearchList = <T extends { id: string }>({
  items = [],
  loading,
  error,
  forceMode,
  errorMessage = "Error Fetching Data",
  noDataMessage = "No Data Found",
  renderTableRow: TableRow,
  renderListItemContent: ListItemContent,
  renderThead: RenderThead,
  onFetchNextPage,
  ...sheetProps
}: SearchListProps<T>) => {
  const isFetchingMore = useRef(false);
  const theme = useTheme();
  const isMobileMq = useMediaQuery(theme.breakpoints.down("md"));
  const hasNoResults = !error && !loading && !items.length;
  const hasResults = !error && !loading && !!items.length;

  const isMobile = (() => {
    if (forceMode && forceMode === "desktop") return false;
    if (forceMode === "mobile") return true;
    return isMobileMq;
  })();

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLUListElement;
    const { scrollHeight, scrollTop, clientHeight } = target;
    const distance = scrollHeight - scrollTop - clientHeight;
    if (distance < 500 && !loading && !isFetchingMore.current) {
      isFetchingMore.current = true;
      onFetchNextPage?.().finally(() => {
        isFetchingMore.current = false;
      });
    }
  };

  return (
    <Sheet {...sheetProps}>
      <Box
        sx={{ height: "100%", overflow: loading ? "hidden" : "auto" }}
        onScroll={onScroll}
      >
        <NoSsr fallback={<LoadingPlaceholder />}>
          {loading && <LoadingPlaceholder />}
          {error && <Ups message={errorMessage} color="danger" />}
          {hasNoResults && <Ups message={noDataMessage} />}
          {hasResults && !isMobile && (
            <Table
              stickyHeader
              sx={{
                "& th:first-of-type, ": {
                  borderTopLeftRadius: "8px !important",
                },

                "& th:last-of-type": {
                  borderTopRightRadius: "8px !important",
                },
              }}
            >
              <RenderThead />
              <tbody>
                {items.map((v) => (
                  <TableRow key={v.id} {...v} />
                ))}
              </tbody>
            </Table>
          )}
          {hasResults && isMobile && (
            <List>
              {items.map((v) => (
                <Fragment key={v.id}>
                  <ListItem>
                    <ListItemContent {...v} />
                  </ListItem>
                  <ListDivider inset={"gutter"} />
                </Fragment>
              ))}
            </List>
          )}
        </NoSsr>
      </Box>
    </Sheet>
  );
};
