export const takeOneOrThrow = <K>(values: K[]): K => {
  if (values.length === 0) throw new Error("No value found");
  if (values.length > 1) throw new Error("Retrieved non-unique value");
  return values[0];
};
