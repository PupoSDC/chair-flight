import { useEffect, useRef } from "react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { cn } from "../../utils/cn";
import { SearchHighlightProvider } from "./search-highlight";
import type { ReactNode } from "react";

export type SearchTableColumn<T> = {
  header: string;
  className?: string;
  render: (item: T) => ReactNode;
};

export const SearchTable = <T extends { id: string }>({
  items,
  columns,
  renderCard,
  hasMore,
  loading,
  emptyMessage,
  query,
  correctedQuery,
  onLoadMore,
}: {
  items: T[];
  columns: SearchTableColumn<T>[];
  renderCard: (item: T) => ReactNode;
  hasMore: boolean;
  loading: boolean;
  emptyMessage: string;
  query: string;
  correctedQuery: string | null;
  onLoadMore: () => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const loadMoreIfNeeded = () => {
    const container = scrollRef.current;
    if (!container || !hasMore || loading) return;
    const distance =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distance < 600) onLoadMore();
  };

  useEffect(loadMoreIfNeeded);

  return (
    <SearchHighlightProvider value={correctedQuery ?? query}>
      <div className="min-h-0 flex-1 px-3 pb-3">
        <div
          ref={scrollRef}
          onScroll={loadMoreIfNeeded}
          className="h-full overflow-auto rounded-lg border border-rule bg-paper"
        >
          {correctedQuery && (
            <p className="m-0 border-b border-rule px-3 py-2 text-xs text-muted">
              No results for &ldquo;{query}&rdquo;. Showing results for{" "}
              <strong className="text-ink">{correctedQuery}</strong>.
            </p>
          )}
          {items.length === 0 && !loading && (
            <p className="p-8 text-center text-sm text-muted">{emptyMessage}</p>
          )}
          {items.length > 0 && isDesktop && (
            <table className="w-full border-separate border-spacing-0 text-[13px]">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.header}
                      className={cn(
                        "sticky top-0 z-10 border-b border-rule bg-paper px-3",
                        "py-2 text-left text-xs font-semibold text-muted",
                        column.className,
                      )}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child_td]:border-b-0">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-accent-soft/40">
                    {columns.map((column) => (
                      <td
                        key={column.header}
                        className={cn(
                          "border-b border-rule px-3 py-2 align-top",
                          column.className,
                        )}
                      >
                        {column.render(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {items.length > 0 && !isDesktop && (
            <ul className="m-0 list-none p-0">
              {items.map((item) => (
                <li key={item.id} className="border-b border-rule px-4 py-3">
                  {renderCard(item)}
                </li>
              ))}
            </ul>
          )}
          {loading && (
            <div className="flex flex-col gap-2 p-3">
              {[0, 1, 2, 3, 4].map((key) => (
                <div
                  key={key}
                  className="h-10 animate-pulse rounded-md bg-rule"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </SearchHighlightProvider>
  );
};
