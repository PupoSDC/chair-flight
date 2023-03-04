/**
 *  Returns a list without any elements that appear more than once.
 *  Convenient for toggling options
 */
export const removeDuplicated = <T>(array: T[]): T[] =>
  array.filter((a, i, arr) => array.indexOf(a) === arr.lastIndexOf(a));
