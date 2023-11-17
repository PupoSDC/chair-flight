import { MissingEnvVariableError } from "@chair-flight/base/errors";

export const getEnvVariableOrThrow = (name: string): string => {
  if (process.env[name]) return process.env[name] as string;
  throw new MissingEnvVariableError(name);
};

export const getEnvVariableOrDefault = (
  name: string,
  defaultValue: string,
): string => {
  if (process.env[name]) return process.env[name] as string;
  return defaultValue;
};

export const getUrlPathOnServer = () => {
  const VERCEL_URL = getEnvVariableOrThrow("VERCEL_URL");
  const PROTOCOL = VERCEL_URL.includes("localhost") ? "http" : "https";
  return `${PROTOCOL}://${VERCEL_URL}`;
};
