import { useState } from "react";

export const usePagedItems = <T>(
  firstPage: {
    items: T[];
    nextOffset: number | null;
  },
  fetchPage: (offset: number) => Promise<{
    items: T[];
    nextOffset: number | null;
  }>,
) => {
  const [loaded, setLoaded] = useState({
    firstPage,
    items: [] as T[],
    nextOffset: firstPage.nextOffset,
  });
  const [loading, setLoading] = useState(false);
  const current =
    loaded.firstPage === firstPage
      ? loaded
      : { firstPage, items: [], nextOffset: firstPage.nextOffset };

  const loadMore = async () => {
    if (current.nextOffset === null) return;
    setLoading(true);
    try {
      const page = await fetchPage(current.nextOffset);
      setLoaded({
        firstPage,
        items: [...current.items, ...page.items],
        nextOffset: page.nextOffset,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    items: [...firstPage.items, ...current.items],
    hasMore: current.nextOffset !== null,
    loading,
    loadMore,
  };
};
