export const removeDuplicates = <T>(arr: T[]): T[] => {
  return arr.filter((item) => arr.indexOf(item) === arr.lastIndexOf(item));
};
