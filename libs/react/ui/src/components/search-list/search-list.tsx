import { Fragment, forwardRef, useRef } from "react";
import type { ForwardedRef, FunctionComponent } from "react";

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

function SearchListInner<T extends { id: string }>(
  {
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
  }: SearchListProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
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
    <Sheet ref={ref} {...sheetProps}>
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
}

const ForwardRefSearchList = forwardRef(SearchListInner);
ForwardRefSearchList.displayName = "SearchList";

export const SearchList = forwardRef(SearchListInner) as typeof SearchListInner;
