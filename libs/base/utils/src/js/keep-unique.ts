export const keepUnique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};
