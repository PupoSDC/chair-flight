import { MissingPathParameter } from "@chair-flight/base/errors";

export const getRequiredParam = <
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  params: T,
  key: K,
): T[K] => {
  const value = params[key];
  if (!value) throw new MissingPathParameter(key as string);
  return value;
};
