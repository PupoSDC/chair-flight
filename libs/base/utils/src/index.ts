export const makeMap = <T, V = T>(
  array: T[],
  getId: (t: T) => string,
  getContent: (t: T) => V = (t) => t as unknown as V,
): Record<string, V> => {
  return array.reduce(
    (sum, v) => {
      sum[getId(v)] = getContent(v);
      return sum;
    },
    {} as Record<string, V>,
  );
};
