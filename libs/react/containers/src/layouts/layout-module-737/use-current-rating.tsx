import { createUsePersistenceHook } from "../../hooks/use-persistence";

export type Rating = "737" | "a320";

const usePersistedRating = createUsePersistenceHook(
  "cf-current-rating",
  "737" as Rating,
);

export const useCurrentRating = (): [Rating, (r: Rating) => void] => {
  const { persistedData, setPersistedData } = usePersistedRating();
  return [persistedData ?? "737", setPersistedData];
};
