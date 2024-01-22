export const makeMap = <T>(
  array: T[],
  getId: (t: T) => string,
): Record<string, T> => {
  return array.reduce(
    (sum, v) => {
      sum[getId(v)] = v;
      return sum;
    },
    {} as Record<string, T>,
  );
};
