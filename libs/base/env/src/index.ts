import { MissingEnvVariableError } from "@chair-flight/base/errors";

export const getEnvVariableOrThrow = (name: string): string => {
  if (process.env[name]) return process.env[name] as string;
  console.log("wtf", process.env[name]);
  throw new MissingEnvVariableError(name);
};

export const getEnvVariableOrDefault = (
  name: string,
  defaultValue: string
): string => {
  if (process.env[name]) return process.env[name] as string;
  return defaultValue;
};
