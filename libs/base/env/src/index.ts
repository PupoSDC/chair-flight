import { MissingEnvVariableError } from "@chair-flight/base/errors";

export const getEnvVariableOrThrow = (name: string): string => {
  if (process.env[name]) return process.env[name] as string;
  throw new MissingEnvVariableError(name);
};

export const getEnvVariableOrDefault = (
  name: string,
  defaultValue: string
): string => {
  if (process.env[name]) return process.env[name] as string;
  return defaultValue;
};
